const words = ["Sharp lines", "Clean fades", "By appointment", "Studio or travel", "Eblendz"];

export function Marquee() {
  // Repeat the words so the strip is long enough to loop without a gap.
  const row = [...words, ...words, ...words, ...words];

  return (
    <div className="overflow-hidden border-y border-line bg-ink-2 py-4" aria-hidden="true">
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-2xl uppercase tracking-wide text-bone/80"
          >
            {word} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}