import { Hero } from "@/components/Hero";
import {Manifesto} from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
    <Nav />
    <main>
      <Hero />
      <Marquee />
      <Manifesto />
    </main>
    </>
  );
}      