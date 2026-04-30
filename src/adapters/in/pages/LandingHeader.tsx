"use client";

import { useState } from "react";
import Link from "next/link";
import { PawPrint, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import { ROUTES } from "@/config/routes";

const navSections = [
  { label: "Funciones", href: "#funciones" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Comunidad", href: "#comunidad" },
];

export default function LandingHeader() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50 animate-fade-in">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <PawPrint className="h-7 w-7" />
          Adopti
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navSections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Button asChild>
              <Link href={ROUTES.DASHBOARD}>Ir al Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
                <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
              </Button>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            aria-controls="landing-mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-fade-in">
          <div className="container py-4 flex flex-col gap-3">
            {navSections.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2"
              >
                {s.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
              {user ? (
                <Button asChild>
                  <Link href={ROUTES.DASHBOARD}>Ir al Dashboard</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
