import { BOOKING_WINDOW_DAYS, normalizePhone, validateBooking, type BookingRequest } from "@/lib/booking";
import { AvailabilityService } from "@/lib/square-services/AvailabilityService";
import { BookingService } from "@/lib/square-services/BookingService";
import { CatalogService } from "@/lib/square-services/CatalogService";
import { CustomerService } from "@/lib/square-services/CustomerService";

type Body = BookingRequest & { idempotencyKey: string; website?: string };

// Simple spam guard: max 5 booking attempts per IP every 10 minutes.
// Lives in memory, so each server instance counts on its own. Good enough for one barber.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, number[]>();

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  // 0. Slow down bots hammering the form
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (tooManyAttempts(ip)) {
    return Response.json(
      { error: "Too many tries. Wait a few minutes or text to book." },
      { status: 429 }
    );
  }

  // 1. Read the JSON body
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 2. Check the shape (never trust the browser)
  const required = [body?.serviceId, body?.startAt, body?.name, body?.phone, body?.idempotencyKey];
  if (required.some((value) => typeof value !== "string")) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Honeypot filled in = a bot. Pretend it worked so it doesn't retry.
  if (body.website) {
    return Response.json({ bookingId: "ok" }, { status: 201 });
  }

  try {
    // 3. Look up the service on the server, so price/length can't be faked
    const services = await new CatalogService().listServices();
    const service = services.find((s) => s.id === body.serviceId);
    if (!service) {
      return Response.json({ error: "Unknown service" }, { status: 400 });
    }
    const isTravel = service.type === "TRAVEL_CUTZ";

    // 4. Same validation rules the form uses
    const fields = validateBooking(body, isTravel);
    if (Object.keys(fields).length > 0) {
      return Response.json({ error: "Check the form", fields }, { status: 400 });
    }

    // 5. Make sure the time is still open right now
    const slots = await new AvailabilityService().findSlots(service.id, BOOKING_WINDOW_DAYS);
    const slot = slots.find((s) => s.startAt === body.startAt);
    if (!slot) {
      return Response.json(
        { error: "Someone just grabbed that time. Pick another one." },
        { status: 409 }
      );
    }

    // 6. Find or create the customer, then book
    const phone = normalizePhone(body.phone)!;
    const customerId = await new CustomerService().findOrCreate(body.name, phone, body.email);

    const note = [
      isTravel ? `TRAVEL ADDRESS: ${body.address!.trim()}` : "",
      body.note?.trim() ?? "",
    ]
      .filter(Boolean)
      .join("\n");

    const bookingId = await new BookingService().create({
      slot,
      serviceId: service.id,
      durationMinutes: service.durationMinutes,
      customerId,
      note,
      idempotencyKey: body.idempotencyKey,
    });

    return Response.json({ bookingId }, { status: 201 });
  } catch (error) {
    console.error("Booking failed:", error);
    return Response.json({ error: "Could not book right now. Text to book instead." }, { status: 502 });
  }
}