import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Marquee } from "@/components/Marquee";

export default function Home() {
  return (
    <>
    <Nav />
    <main>
      <Hero />
      <Marquee />
    </main>
    </>
  );
}      