import Link from "next/link";

export default function BookPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Coming soon</p>
      <h1 className="mt-4 font-display text-6xl uppercase">Online booking</h1>
      <p className="mt-4 max-w-md text-muted">This is where clients will pick a time.</p>
      <Link href="/" className="mt-8 rounded-full border border-line px-6 py-3 hover:border-gold">
        ← Back home
      </Link>
    </main>
  );
}