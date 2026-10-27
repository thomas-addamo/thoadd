import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "thoadd_session";
export const STATE_COOKIE = "thoadd_oauth_state";
const MAX_AGE = 60 * 60 * 24 * 7;

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET non impostata");
  return new TextEncoder().encode(secret);
}

export type Session = { githubId: number; login: string };

export async function createSessionToken(session: Session) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
}

// Valida il token e ricontrolla che sia ancora il tuo account GitHub.
export async function verifySessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<Session>(token, key());
    return String(payload.githubId) === process.env.ALLOWED_GITHUB_ID ? payload : null;
  } catch {
    return null;
  }
}

export const sessionCookie = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: MAX_AGE };

// Da chiamare all'inizio di ogni azione che modifica dati.
export async function requireSession() {
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) throw new Error("Non autorizzato");
  return session;
}
