import { Reveal } from "./Reveal";

export function Quote() {
  return (
    <section className="border-y border-line bg-ink-2 px-4 py-24 text-center sm:px-6">
      <Reveal>
        <p className="mx-auto max-w-3xl font-serif text-4xl italic leading-tight sm:text-6xl">
          &ldquo;Look good. Feel good.{" "}
          <span className="text-gold">Move different.</span>&rdquo;
        </p>
      </Reveal>
    </section>
  );
}