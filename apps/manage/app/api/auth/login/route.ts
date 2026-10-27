import { cookies } from "next/headers";
import { STATE_COOKIE } from "@/lib/session";

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return new Response("GITHUB_CLIENT_ID non impostata", { status: 500 });

  const state = crypto.randomUUID();
  (await cookies()).set(STATE_COOKIE, state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", new URL("/api/auth/callback", request.url).toString());
  url.searchParams.set("scope", "read:user");
  url.searchParams.set("state", state);
  url.searchParams.set("allow_signup", "false");
  return Response.redirect(url);
}
