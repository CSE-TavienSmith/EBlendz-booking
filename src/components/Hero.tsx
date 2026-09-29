import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[88vh] flex-col justify-end overflow-hidden">
      {/* Big faded logo in the empty space */}
      <Logo
        className="pointer-events-none absolute left-1/2 top-16 hidden h-[460px] w-[460px] -translate-x-1/2 opacity-20 md:block"
        decorative
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Columbia, SC · By appointment only
        </p>

        <h1 className="mt-4 font-display text-[22vw] uppercase leading-[0.85] sm:text-[17vw] lg:text-[13rem]">
          Eblendz
        </h1>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-serif text-3xl italic sm:text-4xl">
            Sharp cutz. Clean fades. All around the city.
          </p>

          <div className="flex shrink-0 gap-3">
            
              <a
              href="#book"
              className="whitespace-nowrap rounded-full bg-gold px-6 py-3 font-semibold text-ink transition hover:bg-gold-soft"
            >
              Book a chair →
            </a>

              <a
              href="#work"
              className="whitespace-nowrap rounded-full border border-line px-6 py-3 transition hover:border-bone"
            >
              See the work
            </a>
          </div>
        </div>
      </div>

      <div className="stripe h-3 w-full" aria-hidden="true" />
    </section>
  );
}