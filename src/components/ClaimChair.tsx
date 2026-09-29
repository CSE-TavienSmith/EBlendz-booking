import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Reveal } from "./Reveal";

export function ClaimChair() {
  return (
    <section id="book" className="mx-auto max-w-6xl px-4 py-28 text-center sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">04 — Book</p>
      <Reveal>
        <h2 className="mt-6 font-display text-7xl uppercase leading-[0.9] sm:text-9xl">
          Claim your chair today.
        </h2>
      </Reveal>
      <p className="mt-6 font-serif text-3xl italic text-gold">
        Starting at ${siteConfig.studioPriceFrom}
      </p>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Pick the perfect time for you. You&apos;ll get a confirmation right after.
      </p>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/book?type=HOME_STUDIO"
          className="rounded-full bg-gold px-8 py-4 font-semibold text-ink transition hover:bg-gold-soft"
        >
          Book at the Studio
        </Link>
        <Link
          href="/book?type=TRAVEL"
          className="rounded-full border border-bone/40 px-8 py-4 font-semibold transition hover:border-gold hover:text-gold"
        >
          Book a Travel Cut
        </Link>
      </div>
    </section>
  );
}