import "server-only";
import { SquareClient, SquareEnvironment } from "square";

// One shared client for the whole server (Singleton pattern)
let client: SquareClient | null = null;

export function getSquareClient(): SquareClient {
  if (!client) {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    if (!token) {
      throw new Error("Missing SQUARE_ACCESS_TOKEN in .env.local");
    }

    client = new SquareClient({
      token,
      environment:
        process.env.SQUARE_ENVIRONMENT === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    });
  }
  return client;
}