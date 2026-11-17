import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";

// Add photos to public/gallery and list them here, newest first.
// `alt` describes the cut for screen readers (it isn't shown on the page).
const photos = [
  { src: "/gallery/cut-10.jpg", alt: "Twists with a taper and lineup" },
  { src: "/gallery/cut-9.jpg", alt: "Curly top with a taper and sharp lineup" },
  { src: "/gallery/cut-6.jpg", alt: "Waves with a sharp lineup and beard" },
  { src: "/gallery/cut-7.jpg", alt: "Locs pulled back with a taper and lineup" },
  { src: "/gallery/cut-8.jpg", alt: "Twists with a crisp lineup" },
  { src: "/gallery/cut-1.jpg", alt: "Fade" },
  { src: "/gallery/cut-5.jpg", alt: "Taper" },
  { src: "/gallery/cut-3.jpg", alt: "Lineup" },
];

export function Gallery() {
  return (
    <section id="work" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
          02 — In the Chair
        </p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-5xl uppercase sm:text-6xl">The Work.</h2>
            <a
            href={`https://instagram.com/${siteConfig.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-gold"
          >
            @{siteConfig.instagram} ↗
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scroll-px-4 sm:px-6 sm:scroll-px-6">
        {photos.map((photo, i) => (
          <figure key={i} className="w-64 shrink-0 snap-start sm:w-72">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-ink-2">
              {photo.src ? (
                <Image
                  src={photo.src}
                  alt={`${photo.alt} by Eblendz`}
                  fill
                  sizes="(min-width: 640px) 288px, 256px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-7xl text-line">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </figure>
        ))}
      </div>

      {/* One line under the strip instead of a title on every photo */}
      <div className="mx-auto mt-8 flex max-w-6xl flex-wrap items-baseline justify-between gap-4 px-4 sm:px-6">
        <p className="font-serif text-3xl italic text-bone sm:text-4xl">
          Fresh out the chair! <span className="whitespace-nowrap text-gold">You slide next.</span>
        </p>
        <a
          href="/book"
          className="font-mono text-xs uppercase tracking-[0.2em] text-gold hover:text-gold-soft"
        >
          Claim your chair ↗
        </a>
      </div>
    </section>
  );
}