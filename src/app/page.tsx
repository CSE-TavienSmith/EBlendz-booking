import { Hero } from "@/components/Hero";
import {Manifesto} from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { TheCutz } from "@/components/TheCutz";
import { Gallery } from "@/components/Gallery";

export default function Home() {
  return (
    <>
    <Nav />
    <main>
      <Hero />
      <Marquee />
      <Manifesto />
      <TheCutz />
      <Gallery />
    </main>
    </>
  );
}      