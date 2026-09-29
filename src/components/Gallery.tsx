import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";

// Add photos to public/gallery and fill in `src`, e.g. "/gallery/fade-1.jpg".
const photos = [
  { src: "", caption: "Fade" },
  { src: "", caption: "Taper" },
  { src: "", caption: "Lineup" },
  { src: "", caption: "Travel Cutz" },
  { src: "", caption: "Fresh" },
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
                  alt={`${photo.caption} by Eblendz`}
                  fill
                  sizes="288px"
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
            <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}