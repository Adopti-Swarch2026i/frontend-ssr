"use client";

import { Navbar } from "./Navbar";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import { LoadingSpinner } from "../shared/LoadingSpinner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 animate-fade-in">{children}</main>
    </div>
  );
}
