import { AvailabilityService } from "@/lib/square-services/AvailabilityService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");

  // Validate input before calling Square
  if (!serviceId) {
    return Response.json({ error: "serviceId is required" }, { status: 400 });
  }

  try {
    const slots = await new AvailabilityService().findSlots(serviceId, 7);
    return Response.json(slots);
  } catch (error) {
    console.error("Availability lookup failed:", error);
    return Response.json({ error: "Could not load available times" }, { status: 502 });
  }
}