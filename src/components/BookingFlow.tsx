"use client";

import { useRef, useState } from "react";
import { formatDuration, formatPrice, type AppointmentType, type Service } from "@/lib/services";
import { dayKey, formatDay, formatTime } from "@/lib/time";
import type { TimeSlot } from "@/lib/square-services/AvailabilityService";

const tabs = [
  { label: "At the Studio", type: "HOME_STUDIO" },
  { label: "Travel Cutz", type: "TRAVEL_CUTZ" },
] as const;

type Props = {
  services: Service[];
  initialType: AppointmentType;
};

export function BookingFlow({ services, initialType }: Props) {
  const [type, setType] = useState<AppointmentType>(initialType);
  const [selected, setSelected] = useState<Service | null>(null);

  // Step 2 state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const latestRequest = useRef(0);

  const list = services.filter((s) => s.type === type);

  // Unique days that have openings, in order
  const days = [...new Set(slots.map((s) => dayKey(s.startAt)))];
  const daySlots = slots.filter((s) => dayKey(s.startAt) === day);

  function resetTimes() {
    setSlots([]);
    setDay(null);
    setSlot(null);
    setStatus("idle");
  }

  async function pickService(service: Service) {
    setSelected(service);
    resetTimes();
    setStatus("loading");

    // If they click another cut before this finishes, ignore this answer
    const requestId = ++latestRequest.current;

    try {
      const res = await fetch(`/api/availability?serviceId=${encodeURIComponent(service.id)}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data: TimeSlot[] = await res.json();

      if (requestId !== latestRequest.current) return;
      setSlots(data);
      setDay(data.length > 0 ? dayKey(data[0].startAt) : null);
      setStatus("idle");
    } catch {
      if (requestId === latestRequest.current) setStatus("error");
    }
  }

  return (
    <div>
      {/* Studio / Travel toggle */}
      <div className="inline-flex rounded-full border border-line p-1">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => {
              setType(tab.type);
              setSelected(null);
              resetTimes();
              latestRequest.current++;
            }}
            className={`rounded-full px-5 py-2 text-sm ${
              type === tab.type ? "bg-gold text-ink" : "text-muted hover:text-bone"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Step 1: pick a service */}
      <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-gold">
        1 — Pick your cut
      </h2>
      <ul className="mt-4 space-y-3">
        {list.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => pickService(s)}
              aria-pressed={selected?.id === s.id}
              className={`flex w-full items-baseline gap-4 rounded-xl border px-5 py-4 text-left ${
                selected?.id === s.id ? "border-gold bg-ink-2" : "border-line hover:border-muted"
              }`}
            >
              <span className="text-lg font-medium">{s.name}</span>
              <span className="flex-1" />
              <span className="whitespace-nowrap font-mono text-sm text-muted">
                {formatDuration(s.durationMinutes)}
              </span>
              <span className="font-serif text-2xl italic text-gold">{formatPrice(s.priceCents)}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Step 2: pick a day and time */}
      {selected && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
            2 — Pick a time
          </h2>

          {status === "loading" && <p className="mt-4 text-muted">Loading open times…</p>}

          {status === "error" && (
            <p className="mt-4 text-red-400">
              Couldn&apos;t load times. Try again, or text to book.
            </p>
          )}

          {status === "idle" && slots.length === 0 && (
            <p className="mt-4 text-muted">No openings in the next 7 days. Text to ask about other times.</p>
          )}

          {days.length > 0 && (
            <>
              {/* Days */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {days.map((d) => {
                  const first = slots.find((s) => dayKey(s.startAt) === d)!;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDay(d);
                        setSlot(null);
                      }}
                      aria-pressed={day === d}
                      className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                        day === d ? "border-gold bg-gold text-ink" : "border-line hover:border-muted"
                      }`}
                    >
                      {formatDay(first.startAt)}
                    </button>
                  );
                })}
              </div>

              {/* Times for that day */}
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {daySlots.map((s) => (
                  <button
                    key={s.startAt}
                    type="button"
                    onClick={() => setSlot(s)}
                    aria-pressed={slot?.startAt === s.startAt}
                    className={`rounded-lg border px-3 py-3 font-mono text-sm ${
                      slot?.startAt === s.startAt
                        ? "border-gold bg-ink-2 text-gold"
                        : "border-line hover:border-muted"
                    }`}
                  >
                    {formatTime(s.startAt)}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Temporary: shows what's in state */}
      <p className="mt-8 font-mono text-sm text-muted">
        Selected: {selected ? selected.name : "no cut"} ·{" "}
        {slot ? `${formatDay(slot.startAt)} at ${formatTime(slot.startAt)}` : "no time"}
      </p>
    </div>
  );
}