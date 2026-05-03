"use client";

import { useRouter } from "next/navigation";
import { ReportForm } from "@/adapters/in/components/pets/ReportForm";
import { usePets } from "@/adapters/in/hooks/usePets";
import { ROUTES } from "@/config/routes";
import type { CreateReportInput } from "@/domain/entities/Report";

export function CreateReportPage() {
  const router = useRouter();
  const { createReport, loading } = usePets();

  const handleSubmit = async (data: CreateReportInput) => {
    const result = await createReport(data);
    if (result) {
      router.push(ROUTES.DASHBOARD);
      router.refresh();
    }
  };

  return (
    <main className="space-y-8 animate-fade-in">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
          Reportar mascota
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg">
          Completa el formulario para publicar un reporte de mascota perdida o encontrada.
        </p>
      </header>

      <ReportForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(ROUTES.DASHBOARD)}
        loading={loading}
      />
    </main>
  );
}
