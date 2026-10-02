// All times are shown in the barber's time zone, no matter where the visitor is. 
const TIME_ZONE = "America/New_York";

// "2026-10-04" (used to group slots by day)
export function dayKey(iso: string): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date(iso));  
}

// "Sat, Oct 4"
export function formatDay(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        timeZone: TIME_ZONE,
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

// "10:00 AM"
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });
}