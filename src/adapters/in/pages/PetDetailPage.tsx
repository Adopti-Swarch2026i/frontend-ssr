"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PetDetailView } from "@/adapters/in/components/pets/PetDetailView";
import { LoadingSpinner } from "@/adapters/in/components/shared/LoadingSpinner";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import { useChatContext } from "@/context/ChatContext";
import { usePets } from "@/adapters/in/hooks/usePets";
import { chatConversationHref, petEditHref, ROUTES } from "@/config/routes";
import type { Pet } from "@/domain/entities/Pet";

interface PetDetailPageProps {
  initialPet?: Pet | null;
}

export function PetDetailPage({ initialPet }: PetDetailPageProps = {}) {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();
  const { getPetById, deleteReport, loading } = usePets();
  const { findOrCreateConversation } = useChatContext();
  const [pet, setPet] = useState<Pet | null>(initialPet ?? null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id && !initialPet) {
      getPetById(id).then((p) => setPet(p));
    }
  }, [id, getPetById, initialPet]);

  const handleContact = useCallback(async () => {
    if (!pet || !user) return;
    setContactError(null);
    setContactLoading(true);
    try {
      const conversation = await findOrCreateConversation(pet.reporterId);
      router.push(chatConversationHref(conversation.id));
    } catch (err) {
      setContactError(
        err instanceof Error ? err.message : "No se pudo abrir la conversación"
      );
    } finally {
      setContactLoading(false);
    }
  }, [pet, user, findOrCreateConversation, router]);

  const handleDelete = useCallback(async () => {
    if (!pet) return;
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este reporte? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;
    setDeleteError(null);
    setDeleteLoading(true);
    const ok = await deleteReport(pet.id);
    setDeleteLoading(false);
    if (ok) {
      router.push(ROUTES.DASHBOARD);
    } else {
      setDeleteError("No se pudo eliminar el reporte.");
    }
  }, [pet, deleteReport, router]);

  if (loading) {
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

  return (
    <div className="animate-fade-in">
      <Link
        href={ROUTES.DASHBOARD}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver
      </Link>

      <PetDetailView
        pet={pet}
        onContact={handleContact}
        contactLoading={contactLoading}
        contactError={contactError}
        onEdit={
          user?.id === pet.reporterId
            ? () => router.push(petEditHref(pet.id))
            : undefined
        }
        onDelete={user?.id === pet.reporterId ? handleDelete : undefined}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
      />
    </div>
  );
}
