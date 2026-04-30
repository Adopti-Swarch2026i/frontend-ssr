import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { AppLayout } from "@/adapters/in/components/layout/AppLayout";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }
  return <AppLayout>{children}</AppLayout>;
}
