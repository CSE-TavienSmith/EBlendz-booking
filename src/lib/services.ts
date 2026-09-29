// The shape of one service. Every service must have all of these fields.
export type AppointmentType = "HOME_STUDIO" | "TRAVEL_CUTZ";

export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number; // money in cents: 2000 = $20.00
  type: AppointmentType;
};

// Fake data for now. Later this comes live from Square.
export const sampleServices: Service[] = [
  { id: "1", name: "Haircut", durationMinutes: 60, priceCents: 2000, type: "HOME_STUDIO" },
  { id: "2", name: "Haircut + Beard", durationMinutes: 75, priceCents: 2500, type: "HOME_STUDIO" },
  { id: "3", name: "Haircut (Travel)", durationMinutes: 60, priceCents: 2500, type: "TRAVEL_CUTZ" },
  { id: "4", name: "Haircut + Beard (Travel)", durationMinutes: 75, priceCents: 3000, type: "TRAVEL_CUTZ" },
];

export function formatPrice(cents: number): string {
  return `$${cents / 100}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60); // whole hours: 75 -> 1
  const mins = minutes % 60;              // leftover minutes: 75 -> 15

  if (hours === 0) return `${mins} min`;          // 45  -> "45 min"
  if (mins === 0) return `${hours} hr`;           // 60  -> "1 hr"
  return `${hours} hr ${mins} min`;               // 75  -> "1 hr 15 min"
}