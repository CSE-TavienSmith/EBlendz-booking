import { CatalogService } from "@/lib/square-services/CatalogService";

export async function GET() {
  try {
    const services = await new CatalogService().listServices();
    return Response.json(services);
  } catch (error) {
    console.error("Could not load services:", error);
    return Response.json({ error: "Could not load services" }, { status: 502 });
  }
}
