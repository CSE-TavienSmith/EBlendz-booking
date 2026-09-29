import { ClaimChair } from "@/components/ClaimChair";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { Menu } from "@/components/Menu";
import { Nav } from "@/components/Nav";
import { Quote } from "@/components/Quote";
import { TheCutz } from "@/components/TheCutz";
import { sampleServices } from "@/lib/services";

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
        <Menu services={sampleServices} />
        <Quote />
        <ClaimChair />
      </main>
      <Footer />
    </>
  );
}