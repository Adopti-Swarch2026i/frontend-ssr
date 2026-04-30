import "server-only";
import { cookies } from "next/headers";
import { getFirebaseAuth } from "@/adapters/out/firebase/firebaseAdmin";
import { getServerEnv } from "@/lib/env";

export interface Session {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;
}

export async function createSession(
  idToken: string
): Promise<{ cookieValue: string; expiresAt: Date }> {
  const env = getServerEnv();
  const expiresIn = env.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;
  const cookieValue = await getFirebaseAuth().createSessionCookie(idToken, {
    expiresIn,
  });
  const expiresAt = new Date(Date.now() + expiresIn);
  return { cookieValue, expiresAt };
}

export async function verifySession(): Promise<Session | null> {
  const env = getServerEnv();
  const cookieStore = await cookies();
  const cookie = cookieStore.get(env.SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;
  try {
    const decoded = await getFirebaseAuth().verifySessionCookie(
      cookie.value,
      true
    );
    return {
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
      name: decoded.name as string | undefined,
      picture: decoded.picture as string | undefined,
    };
  } catch (err) {
    console.warn(
      "[session] verifySessionCookie failed:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

export async function clearSession(uid?: string): Promise<void> {
  const env = getServerEnv();
  const cookieStore = await cookies();
  cookieStore.delete(env.SESSION_COOKIE_NAME);
  if (uid) {
    try {
      await getFirebaseAuth().revokeRefreshTokens(uid);
    } catch (err) {
      console.warn(
        "[session] revokeRefreshTokens failed:",
        err instanceof Error ? err.message : err
      );
    }
  }
}

export async function getSessionCookieValue(): Promise<string | null> {
  const env = getServerEnv();
  const cookieStore = await cookies();
  return cookieStore.get(env.SESSION_COOKIE_NAME)?.value ?? null;
}
