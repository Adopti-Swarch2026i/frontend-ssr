import { NextResponse } from "next/server";
import { clearSession, verifySession } from "@/lib/session";

export const runtime = "nodejs";

export async function DELETE() {
  const session = await verifySession();
  await clearSession(session?.uid);
  return new NextResponse(null, { status: 204 });
}
