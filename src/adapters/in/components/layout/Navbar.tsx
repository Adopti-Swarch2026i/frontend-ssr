"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PawPrint, MessageCircle, LogOut, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import { useChatContext } from "@/context/ChatContext";
import { ROUTES } from "@/config/routes";

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalUnread } = useChatContext();
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: "Mascotas", path: ROUTES.DASHBOARD, icon: PawPrint },
    { label: "Reportar", path: ROUTES.CREATE_REPORT, icon: Plus },
    { label: "Chat", path: ROUTES.CHAT, icon: MessageCircle, badge: totalUnread },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-2 font-heading text-lg font-bold text-foreground"
          >
            <PawPrint className="h-5 w-5 text-primary" />
            Adopti
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              const badge = (link as { badge?: number }).badge ?? 0;
              return (
                <Link key={link.path} href={link.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-1.5 cursor-pointer relative"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    {badge > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] leading-none h-4 min-w-4 px-1">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback className="text-xs">
                      {user.displayName?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-xs font-medium">
                    {user.displayName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(ROUTES.PROFILE)}
                  className="gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    router.push(ROUTES.LANDING);
                  }}
                  className="gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
