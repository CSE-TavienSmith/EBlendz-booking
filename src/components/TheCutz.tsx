import { Reveal } from "./Reveal";

const options = [
  {
    label: "Home studio",
    title: "At the Studio",
    price: "From $20",
    body: "Pull up to the chair. The exact address is sent after you book.",
  },
  {
    label: "Travel cutz",
    title: "I Come To You",
    price: "$25–30",
    body: "Dorm, apartment, or event day. The clippers travel. The lineup stays sharp.",
  },
];

export function TheCutz() {
  return (
    <section id="cutz" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
        01 — The Cutz
      </p>
      <h2 className="mt-4 font-display text-5xl uppercase sm:text-6xl">Two ways to get in.</h2>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {options.map((option, i) => (
          <Reveal key={option.title} delay={i * 120}>
              <a 
              href="#book"
              className="group block rounded-2xl border border-line bg-ink-2 p-7 transition hover:border-gold"
            >
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                {option.label}
              </p>
              <div className="mt-6 flex items-end justify-between gap-4">
                <h3 className="font-display text-4xl uppercase">{option.title}</h3>
                <p className="font-serif text-3xl italic text-gold">{option.price}</p>
              </div>
              <p className="mt-4 text-muted">{option.body}</p>
              <p className="mt-8 text-sm font-semibold transition group-hover:text-gold">
                Book this →
              </p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}