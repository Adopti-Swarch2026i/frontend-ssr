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
    response.cookies.set({
      name: env.SESSION_COOKIE_NAME,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
