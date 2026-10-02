import "server-only";
import { SquareClient, SquareEnvironment } from "square";

const isProduction = process.env.SQUARE_ENVIRONMENT === "production";
const environment = isProduction ? SquareEnvironment.Production : SquareEnvironment.Sandbox;

// Where Square's OAuth pages live (used by the one-time connect step)
export const squareConnectUrl = isProduction
  ? "https://connect.squareup.com"
  : "https://connect.squareupsandbox.com";

// Buyer-level permissions only, so the barber can stay on the free plan
export const SQUARE_SCOPES = [
  "ITEMS_READ",
  "APPOINTMENTS_READ",
  "APPOINTMENTS_WRITE",
  "CUSTOMERS_READ",
  "CUSTOMERS_WRITE",
];

// Client used only to get tokens (no token needed for that call)
export function getOAuthClient(): SquareClient {
  return new SquareClient({ environment, auth: false });
}

// Cached access token, refreshed a few minutes before it expires
let cached: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt - 5 * 60 * 1000) {
    return cached.token;
  }

  const clientId = process.env.SQUARE_APPLICATION_ID;
  const clientSecret = process.env.SQUARE_APPLICATION_SECRET;
  const refreshToken = process.env.SQUARE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Square OAuth settings in .env.local");
  }

  const result = await getOAuthClient().oAuth.obtainToken({
    clientId,
    clientSecret,
    grantType: "refresh_token",
    refreshToken,
  });
  if (!result.accessToken || !result.expiresAt) {
    throw new Error("Square did not return an access token");
  }

  cached = { token: result.accessToken, expiresAt: new Date(result.expiresAt).getTime() };
  return cached.token;
}

// One shared client for the whole server (Singleton pattern)
let client: SquareClient | null = null;

export function getSquareClient(): SquareClient {
  if (!client) {
    client = new SquareClient({ environment, token: getAccessToken });
  }
  return client;
}