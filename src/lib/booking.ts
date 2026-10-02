// Shared by the browser (instant feedback) and the server (the real check).

export type BookingRequest = {
  serviceId: string;
  startAt: string;
  name: string;
  phone: string;
  email?: string;
  address?: string; // travel cutz only
  note?: string;
};

export type FieldErrors = Partial<Record<keyof BookingRequest, string>>;

// "(803) 555-0123" -> "+18035550123", or null if it isn't a US number
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return ten.length === 10 ? `+1${ten}` : null;
}

export function validateBooking(req: BookingRequest, isTravel: boolean): FieldErrors {
  const errors: FieldErrors = {};

  if (req.name.trim().length < 2) errors.name = "Enter your name.";
  if (!normalizePhone(req.phone)) errors.phone = "Enter a 10-digit phone number.";
  if (req.email && !/^\S+@\S+\.\S+$/.test(req.email)) errors.email = "Enter a valid email.";
  if (isTravel && (req.address ?? "").trim().length < 8) errors.address = "Enter the full address.";
  if ((req.note ?? "").length > 300) errors.note = "Keep notes under 300 characters.";

  return errors;
}