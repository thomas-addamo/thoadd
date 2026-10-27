import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  (await cookies()).delete(SESSION_COOKIE);
  return Response.redirect(new URL("/login", request.url), 303);
}
