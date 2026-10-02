import Link from "next/link";
import { BookingFlow } from "@/components/BookingFlow";
import { CatalogService } from "@/lib/square-services/CatalogService";
import type { AppointmentType } from "@/lib/services";

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function BookPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const initialType: AppointmentType = type === "TRAVEL_CUTZ" ? "TRAVEL_CUTZ" : "HOME_STUDIO";
  const services = await new CatalogService().listServices();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/" className="font-mono text-xs uppercase tracking-[0.25em] text-muted hover:text-gold">
        ← Eblendz
      </Link>
      <h1 className="mt-6 font-display text-5xl uppercase sm:text-6xl">Book a cut.</h1>

      <div className="mt-10">
        <BookingFlow services={services} initialType={initialType} />
      </div>
    </main>
  );
}