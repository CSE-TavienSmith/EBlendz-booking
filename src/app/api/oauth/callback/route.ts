import { NextResponse, type NextRequest } from "next/server";
import { getOAuthClient } from "@/lib/square";

// Square sends the barber back here after he approves
export async function GET(request: NextRequest) {
  if (process.env.SQUARE_OAUTH_SETUP !== "true") {
    return new Response("Not found", { status: 404 });
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("square_oauth_state")?.value;

  if (!code || !state || state !== savedState) {
    return new Response("Invalid or expired request. Start again at /api/oauth/start.", {
      status: 400,
    });
  }

  try {
    const result = await getOAuthClient().oAuth.obtainToken({
      clientId: process.env.SQUARE_APPLICATION_ID ?? "",
      clientSecret: process.env.SQUARE_APPLICATION_SECRET,
      code,
      grantType: "authorization_code",
    });

    // Printed only in the server terminal, never sent to the browser
    console.log("\nAdd this line to .env.local:\nSQUARE_REFRESH_TOKEN=" + result.refreshToken + "\n");

    const response = new NextResponse(
      "Connected to Square. Copy SQUARE_REFRESH_TOKEN from the terminal into .env.local, then set SQUARE_OAUTH_SETUP=false."
    );
    response.cookies.delete("square_oauth_state");
    return response;
  } catch (error) {
    console.error("OAuth token exchange failed:", error);
    return new Response("Could not connect to Square. Check the terminal.", { status: 502 });
  }
}