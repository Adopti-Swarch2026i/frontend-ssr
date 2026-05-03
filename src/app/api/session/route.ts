import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/session";
import { getServerEnv } from "@/lib/env";

export const runtime = "nodejs";

const bodySchema = z.object({
  idToken: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }
  try {
    const { cookieValue, expiresAt } = await createSession(parsed.data.idToken);
    const env = getServerEnv();
    const response = NextResponse.json({ ok: true });
    // Detrás de NGINX (gateway) `request.url` siempre es http://frontend:3000
    // aunque el cliente original venga por HTTPS. Por eso preferimos el
    // header X-Forwarded-Proto cuando el reverse proxy lo añade.
    // SESSION_COOKIE_SECURE=true|false fuerza el flag explícitamente para
    // dev local sobre HTTP donde el navegador rechaza Secure.
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const explicit = process.env.SESSION_COOKIE_SECURE;
    const secureCookie =
      explicit === "true"
        ? true
        : explicit === "false"
          ? false
          : forwardedProto
            ? forwardedProto.split(",")[0].trim() === "https"
            : new URL(request.url).protocol === "https:";
    response.cookies.set({
      name: env.SESSION_COOKIE_NAME,
      value: cookieValue,
      httpOnly: true,
      secure: secureCookie,
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });
    return response;
  } catch (err) {
    console.error("[POST /api/session] error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
