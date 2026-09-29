import { Reveal } from "./Reveal";

export function Manifesto() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <Reveal>
        <h2 className="font-display text-6xl uppercase leading-[0.9] sm:text-8xl">
          Fresh when <br />
          it <span className="font-serif normal-case italic text-gold">matters.</span>
        </h2>
      </Reveal>

      <Reveal delay={150}>
        <p className="mt-8 max-w-xl text-lg text-muted">
          For the haircuts that come in clutch when needed. Interviews, game days, parties, date nights, or even Sunday service. Book the chair, skip the DMs.
        </p>
      </Reveal>
    </section>
  );
}