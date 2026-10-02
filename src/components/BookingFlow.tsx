"use client";

import { useState } from "react";
import { formatDuration, formatPrice, type AppointmentType, type Service } from "@/lib/services";

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

  const list = services.filter((s) => s.type === type);

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
              onClick={() => setSelected(s)}
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

      {/* Temporary: shows what's in state */}
      <p className="mt-8 font-mono text-sm text-muted">
        Selected: {selected ? `${selected.name} (${selected.id})` : "nothing yet"}
      </p>
    </div>
  );
}