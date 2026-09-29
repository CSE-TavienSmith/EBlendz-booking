import { formatDuration, formatPrice, type Service } from "@/lib/services";
import { siteConfig } from "@/lib/siteConfig";

const groups = [
  { title: "At the Studio", type: "HOME_STUDIO" },
  { title: "Travel Cutz", type: "TRAVEL_CUTZ" },
] as const;

export function Menu({ services }: { services: Service[] }) {
  return (
    <section id="menu" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">03 — The Menu</p>
      <h2 className="mt-4 font-display text-5xl uppercase sm:text-6xl">Pick your cut.</h2>

      <div className="mt-10 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div>
          {groups.map((group) => {
            const list = services.filter((s) => s.type === group.type);
            if (list.length === 0) return null;

            return (
              <div key={group.type} className="mb-10">
                <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-gold">
                  {group.title}
                </h3>
                <ul>
                  {list.map((s) => (
                    <li key={s.id} className="flex items-baseline gap-4 border-b border-line py-4">
                      <span className="text-lg font-medium">{s.name}</span>
                      <span className="flex-1 border-b border-dotted border-line" aria-hidden="true" />
                      <span className="font-mono text-sm text-muted">{formatDuration(s.durationMinutes)}</span>
                      <span className="w-16 text-right font-serif text-2xl italic text-gold">
                        {formatPrice(s.priceCents)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-ink-2 p-7">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
            Every cut comes with
          </h3>
          <ul className="mt-5 space-y-3">
            {siteConfig.everyCutIncludes.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}