import { CatalogService } from "@/lib/square-services/CatalogService";

export async function GET() {
  const services = await new CatalogService().listServices();
  return Response.json(services);
}