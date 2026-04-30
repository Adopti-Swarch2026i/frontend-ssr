"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollMorphHero from "@/components/effects/scroll-morph-hero";
import { GoogleSignInButton } from "@/adapters/in/components/auth/GoogleSignInButton";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import { ROUTES } from "@/config/routes";

export function LoginPage() {
  const { user, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace(ROUTES.DASHBOARD);
  }, [user, router]);

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión con Google"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      <section className="hidden lg:flex flex-1 relative overflow-hidden">
        <ScrollMorphHero />
      </section>

      <section className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-sm animate-fade-in-up">
          <CardContent className="pt-8 pb-8 space-y-6">
            <header className="flex flex-col items-center gap-3 text-center">
              <PawPrint className="h-10 w-10 text-primary" />
              <h1 className="text-2xl font-bold">Bienvenido a Adopti</h1>
              <p className="text-sm text-muted-foreground">
                Inicia sesión para reportar y buscar mascotas
              </p>
            </header>

            <GoogleSignInButton onClick={handleGoogle} loading={loading} />

            {error && (
              <p role="alert" className="text-sm text-destructive text-center">
                {error}
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
