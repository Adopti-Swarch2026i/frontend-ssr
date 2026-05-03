"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PetDetailView } from "@/adapters/in/components/pets/PetDetailView";
import { LoadingSpinner } from "@/adapters/in/components/shared/LoadingSpinner";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import { useChatContext } from "@/context/ChatContext";
import { usePets } from "@/adapters/in/hooks/usePets";
import { chatConversationHref, petEditHref, ROUTES, petDetailHref } from "@/config/routes";
import type { Pet } from "@/domain/entities/Pet";

interface MatchSuggestion {
  lostPetId: number;
  lostReportId: number;
  foundPetId: number;
  foundReportId: number;
  score: number;
  species: string | null;
  breed: string | null;
  color: string | null;
  city: string | null;
}

interface PetDetailPageProps {
  initialPet?: Pet | null;
  initialMatches?: MatchSuggestion[];
}

export function PetDetailPage({
  initialPet,
  initialMatches = [],
}: PetDetailPageProps = {}) {
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
      router.refresh();
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

      {initialMatches.length > 0 && (
        <section className="mt-10">
          <header className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Coincidencias sugeridas
            </h2>
            <span className="text-xs text-muted-foreground">
              {initialMatches.length}
            </span>
          </header>
          <ul className="grid gap-3 sm:grid-cols-2">
            {initialMatches.map((m) => {
              // El frontend identifica una mascota por report.id (mapReportToPet
              // hace id: String(report.id)), por eso el link usa el reportId del
              // contraparte, no el petId.
              const otherReportId =
                pet.status === "lost" ? m.foundReportId : m.lostReportId;
              const otherPetId =
                pet.status === "lost" ? m.foundPetId : m.lostPetId;
              const scorePct = Math.round(m.score * 100);
              return (
                <li
                  key={`${m.lostReportId}-${m.foundReportId}`}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <Link
                    href={petDetailHref(String(otherReportId))}
                    className="block hover:opacity-90"
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-medium text-foreground">
                        Mascota #{otherPetId} · Reporte #{otherReportId}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                        title="Score absoluto del match (0–100)"
                      >
                        {scorePct}%
                      </span>
                    </div>
                    <dl className="text-xs text-muted-foreground space-y-0.5">
                      {m.species && (
                        <div>
                          <dt className="inline font-medium">Especie:</dt>{" "}
                          <dd className="inline">{m.species}</dd>
                        </div>
                      )}
                      {m.breed && (
                        <div>
                          <dt className="inline font-medium">Raza:</dt>{" "}
                          <dd className="inline">{m.breed}</dd>
                        </div>
                      )}
                      {m.color && (
                        <div>
                          <dt className="inline font-medium">Color:</dt>{" "}
                          <dd className="inline">{m.color}</dd>
                        </div>
                      )}
                      {m.city && (
                        <div>
                          <dt className="inline font-medium">Ciudad:</dt>{" "}
                          <dd className="inline">{m.city}</dd>
                        </div>
                      )}
                    </dl>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
