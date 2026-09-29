import { getSquareClient } from "@/lib/square";

export async function GET() {
  const square = getSquareClient();
  const result = await square.locations.list();

  return Response.json({
    locations: result.locations?.map((loc) => ({
      id: loc.id,
      name: loc.name,
    })),
  });
}