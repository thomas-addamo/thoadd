import { cookies } from "next/headers";
import { createSessionToken, SESSION_COOKIE, sessionCookie, STATE_COOKIE } from "@/lib/session";

const fail = (request: Request, reason: string) => Response.redirect(new URL(`/login?errore=${reason}`, request.url));

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const store = await cookies();
  const expected = store.get(STATE_COOKIE)?.value;
  store.delete(STATE_COOKIE);
  if (!params.get("code") || !expected || params.get("state") !== expected) return fail(request, "stato");

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: params.get("code"),
      redirect_uri: new URL("/api/auth/callback", request.url).toString(),
    }),
  });
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) return fail(request, "github");

  const userRes = await fetch("https://api.github.com/user", {
    headers: { authorization: `Bearer ${access_token}`, accept: "application/vnd.github+json", "user-agent": "manage.thoadd.com" },
  });
  const user = (await userRes.json()) as { id?: number; login?: string };
  if (!user.id || String(user.id) !== process.env.ALLOWED_GITHUB_ID) return fail(request, "account");

  store.set(SESSION_COOKIE, await createSessionToken({ githubId: user.id, login: user.login ?? "" }), sessionCookie);
  return Response.redirect(new URL("/", request.url));
}
