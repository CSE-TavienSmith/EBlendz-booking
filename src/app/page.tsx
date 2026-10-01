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
import { CatalogService } from "@/lib/square-services/CatalogService";
import { sampleServices, type Service } from "@/lib/services";

// Re-check Square for price changes at most every 5 minutes 
export const revalidate = 300;

async function getServices(): Promise<Service[]> {
  try {
    const services = await new CatalogService().listServices();
    return services.length > 0 ? services : sampleServices; 
  } catch (error) {
    console.error("Could not load services from Square:", error);
    return sampleServices;
  }
}
export default async function Home() {
  const services = await getServices();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <TheCutz />
        <Gallery />
        <Menu services={services} />
        <Quote />
        <ClaimChair />
      </main>
      <Footer />
    </>
  );
}