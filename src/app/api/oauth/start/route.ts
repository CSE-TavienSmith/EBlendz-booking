import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { SQUARE_SCOPES, squareConnectUrl } from "@/lib/square";

// One-time setup: sends the barber to Square to approve the app
export async function GET() {
  if (process.env.SQUARE_OAUTH_SETUP !== "true") {
    return new Response("Not found", { status: 404 });
  }

  const state = randomUUID(); // random value to block forged callbacks (CSRF)
  const url = new URL("/oauth2/authorize", squareConnectUrl);
  url.searchParams.set("client_id", process.env.SQUARE_APPLICATION_ID ?? "");
  url.searchParams.set("scope", SQUARE_SCOPES.join(" "));
  url.searchParams.set("session", "false");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set("square_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });
  return response;
}