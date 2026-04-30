"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  ReportForm,
  type ReportFormInitialData,
} from "@/adapters/in/components/pets/ReportForm";
import { LoadingSpinner } from "@/adapters/in/components/shared/LoadingSpinner";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import { usePets } from "@/adapters/in/hooks/usePets";
import { petDetailHref, ROUTES } from "@/config/routes";
import type { Pet } from "@/domain/entities/Pet";
import type { CreateReportInput } from "@/domain/entities/Report";

export function EditReportPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();
  const { getPetById, updateReport, loading } = usePets();
  const [pet, setPet] = useState<Pet | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPetById(id).then((p) => {
      setPet(p);
      setFetched(true);
    });
  }, [id, getPetById]);

  if (!fetched) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Mascota no encontrada
        </h2>
        <Link
          href={ROUTES.DASHBOARD}
          className="inline-flex items-center gap-1 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver
        </Link>
      </div>
    );
  }

  if (user?.id !== pet.reporterId) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Sin permisos
        </h2>
        <p className="text-sm text-muted-foreground">
          Solo el autor del reporte puede editarlo.
        </p>
        <Link
          href={petDetailHref(pet.id)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al reporte
        </Link>
      </div>
    );
  }

  const initialData: ReportFormInitialData = {
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    color: pet.color,
    age: pet.age,
    description: pet.description,
    status: pet.status,
    location: pet.location,
    city: pet.city,
    date: pet.date,
    contactPhone: pet.contactPhone,
    imageUrls: pet.imageUrls,
  };

  const handleSubmit = async (data: CreateReportInput) => {
    const result = await updateReport({ id: pet.id, ...data });
    if (result) {
      router.push(petDetailHref(pet.id));
    }
  };

  return (
    <main className="space-y-8 animate-fade-in">
      <Link
        href={petDetailHref(pet.id)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver al reporte
      </Link>

      <header className="space-y-2">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
          Editar reporte
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg">
          Actualiza la información de tu reporte. Si la mascota ya fue reunida,
          cambia el estado a &quot;Reunida&quot;.
        </p>
      </header>

      <ReportForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => router.push(petDetailHref(pet.id))}
        loading={loading}
      />
    </main>
  );
}
