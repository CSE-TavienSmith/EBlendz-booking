"use client";

import { useRef, useState } from "react";
import { validateBooking, type BookingRequest, type FieldErrors } from "@/lib/booking";
import { formatDuration, formatPrice, type AppointmentType, type Service } from "@/lib/services";
import { siteConfig } from "@/lib/siteConfig";
import { dayKey, formatDay, formatTime } from "@/lib/time";
import type { TimeSlot } from "@/lib/square-services/AvailabilityService";

const tabs = [
  { label: "At the Studio", type: "HOME_STUDIO" },
  { label: "Travel Cutz", type: "TRAVEL_CUTZ" },
] as const;

const emptyForm = { name: "", phone: "", email: "", address: "", note: "" };

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

  // Step 3 state
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [booked, setBooked] = useState<{ service: Service; slot: TimeSlot } | null>(null);
  const idempotencyKey = useRef<string | null>(null);

  const isTravel = type === "TRAVEL_CUTZ";
  const list = services.filter((s) => s.type === type);

  // Unique days that have openings, in order
  const days = [...new Set(slots.map((s) => dayKey(s.startAt)))];
  const daySlots = slots.filter((s) => dayKey(s.startAt) === day);

  function resetTimes() {
    setSlots([]);
    setDay(null);
    setSlot(null);
    setStatus("idle");
    idempotencyKey.current = null;
  }

  function chooseSlot(next: TimeSlot | null) {
    setSlot(next);
    setNotice("");
    idempotencyKey.current = null; // new time = new booking attempt
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

  function updateField(name: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined })); // clear that field's error
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    if (!selected || !slot) return;

    const request: BookingRequest = {
      serviceId: selected.id,
      startAt: slot.startAt,
      ...form,
      address: isTravel ? form.address : undefined,
    };

    // Instant feedback with the same rules the server uses
    const errors = validateBooking(request, isTravel);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Same key if they retry this exact time, so Square never books it twice
    idempotencyKey.current ??= crypto.randomUUID();
    setSending(true);
    setNotice("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...request, idempotencyKey: idempotencyKey.current }),
      });
      const data = await res.json();

      if (res.status === 201) {
        setBooked({ service: selected, slot });
        return;
      }

      if (res.status === 409) {
        // Time was taken: reload the times but keep what they typed
        await pickService(selected);
        setNotice(data.error);
        return;
      }

      if (data.fields) setFieldErrors(data.fields);
      setNotice(data.error ?? "Something went wrong. Try again.");
    } catch {
      setNotice("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  // Confirmation screen
  if (booked) {
    return (
      <div className="rounded-2xl border border-gold bg-ink-2 p-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">Booked</p>
        <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">You&apos;re locked in.</h2>
        <p className="mt-6 text-lg">
          {booked.service.name} · {formatPrice(booked.service.priceCents)}
        </p>
        <p className="mt-1 text-lg">
          {formatDay(booked.slot.startAt)} at {formatTime(booked.slot.startAt)}
        </p>
        <p className="mt-6 text-muted">
          {booked.service.type === "TRAVEL_CUTZ"
            ? `He's coming to you at: ${form.address.trim()}`
            : "He'll text you the address before your cut."}
        </p>
        <p className="mt-2 text-muted">
          Need to change it?{" "}
          <a href={`sms:${siteConfig.phone}`} className="text-gold underline">
            Text {siteConfig.phone}
          </a>
        </p>
      </div>
    );
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
              setNotice("");
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
      {isTravel && <p className="mt-3 text-sm text-muted">{siteConfig.travelArea}</p>}

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

          {notice && !slot && (
            <p role="alert" className="mt-4 text-red-400">
              {notice}
            </p>
          )}

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
                        chooseSlot(null);
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
                    onClick={() => chooseSlot(s)}
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

      {/* Step 3: your info + confirm */}
      {selected && slot && (
        <form onSubmit={handleSubmit} noValidate className="mt-12 space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-gold">3 — Your info</h2>

          <Field label="Name" error={fieldErrors.name}>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              autoComplete="name"
              className={inputClass}
            />
          </Field>

          <Field label="Phone (he'll text you)" error={fieldErrors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              autoComplete="tel"
              placeholder="(803) 555-1234"
              className={inputClass}
            />
          </Field>

          <Field label="Email (optional)" error={fieldErrors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          {isTravel && (
            <Field label={`Address (${siteConfig.travelArea.toLowerCase()})`} error={fieldErrors.address}>
              <input
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                autoComplete="street-address"
                className={inputClass}
              />
            </Field>
          )}

          <Field label="Anything he should know? (optional)" error={fieldErrors.note}>
            <textarea
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              rows={3}
              maxLength={300}
              className={inputClass}
            />
          </Field>

          {/* Summary + submit */}
          <div className="rounded-xl border border-line bg-ink-2 p-5">
            <p className="text-lg">
              {selected.name} · {formatPrice(selected.priceCents)}
            </p>
            <p className="text-muted">
              {formatDay(slot.startAt)} at {formatTime(slot.startAt)} · {formatDuration(selected.durationMinutes)}
            </p>
          </div>

          {notice && (
            <p role="alert" className="text-red-400">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-full bg-gold px-6 py-4 font-semibold text-ink transition hover:bg-gold-soft disabled:opacity-50"
          >
            {sending ? "Booking…" : "Book it"}
          </button>
        </form>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-ink px-4 py-3 text-bone placeholder:text-muted focus:border-gold focus:outline-none";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-400">{error}</span>}
    </label>
  );
}