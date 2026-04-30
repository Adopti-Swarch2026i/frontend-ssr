"use client";
import Link from "next/link";
import { PawPrint, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 animate-fade-in-up">
        <PawPrint className="h-20 w-20 text-muted-foreground/50 mx-auto animate-bounce-gentle" />
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-xl font-semibold">Esta pagina se perdio...</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          No pudimos encontrar la pagina que buscas, pero no te preocupes,
          podemos ayudarte a volver.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href={ROUTES.LANDING}>
              <Home className="h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
