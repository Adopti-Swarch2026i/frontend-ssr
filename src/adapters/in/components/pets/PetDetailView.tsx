"use client";

import { MapPin, Calendar, User, Phone, MessageCircle, PawPrint, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircularGallery } from "@/components/effects/circular-gallery";
import { StatusBadge } from "./StatusBadge";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import type { Pet } from "@/domain/entities/Pet";

interface PetDetailViewProps {
  pet: Pet;
  onContact: () => void;
  contactLoading?: boolean;
  contactError?: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteLoading?: boolean;
  deleteError?: string | null;
}

const speciesLabels: Record<string, string> = {
  dog: "Perro",
  cat: "Gato",
  bird: "Ave",
  other: "Otro",
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label?: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 text-muted-foreground shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span className="text-foreground">
        {label && <span className="text-muted-foreground mr-1">{label}</span>}
        {value}
      </span>
    </div>
  );
}

export function PetDetailView({
  pet,
  onContact,
  contactLoading = false,
  contactError = null,
  onEdit,
  onDelete,
  deleteLoading = false,
  deleteError = null,
}: PetDetailViewProps) {
  const { user } = useAuth();
  const isOwner = user?.id === pet.reporterId;
  const speciesLabel = speciesLabels[pet.species] ?? pet.species;
  const subtitle = pet.breed ? `${speciesLabel} · ${pet.breed}` : speciesLabel;
  const contactLabel =
    pet.status === "lost" ? "Contactar al dueño" : "Contactar al reportante";

  const galleryImages = (pet.imageUrls.length > 0 ? pet.imageUrls : ["/placeholder-pet.svg"]).map(
    (url, i) => ({ src: url, alt: `Foto ${i + 1} de ${pet.name}` })
  );

  return (
    <div className="space-y-8">
      {/* ── Gallery (centered top) ─────────────────────────── */}
      <CircularGallery images={galleryImages} />

      {/* ── Info card ──────────────────────────────────────── */}
      <Card className="animate-fade-in-up shadow-sm max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground leading-tight">
                {pet.name}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>
            </div>
            <StatusBadge status={pet.status} />
          </div>

          <Separator />

          {/* Characteristics */}
          {(pet.color || pet.age) && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {pet.color && (
                  <div className="bg-muted/60 rounded-lg px-3 py-2.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                      Color
                    </p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {pet.color}
                    </p>
                  </div>
                )}
                {pet.age && (
                  <div className="bg-muted/60 rounded-lg px-3 py-2.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                      Edad
                    </p>
                    <p className="text-sm font-medium text-foreground">{pet.age}</p>
                  </div>
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Location & date */}
          <div className="space-y-2.5">
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              value={`${pet.location}, ${pet.city}`}
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              value={new Date(pet.date).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-heading font-semibold text-sm text-foreground mb-2">
              Descripción
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {pet.description}
            </p>
          </div>

          <Separator />

          {/* Reporter */}
          <div className="space-y-2">
            <InfoRow
              icon={<User className="h-4 w-4" />}
              label="Reportado por:"
              value={<strong>{pet.reporterName}</strong>}
            />
            {pet.contactPhone && (
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                value={pet.contactPhone}
              />
            )}
          </div>

          {/* CTA */}
          {isOwner ? (
            <div className="space-y-2">
              <div
                className="flex items-center justify-center gap-2 w-full rounded-md border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
                role="note"
              >
                <PawPrint className="h-4 w-4" aria-hidden="true" />
                Este es tu reporte
              </div>
              {onEdit && (
                <Button
                  onClick={onEdit}
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Editar reporte
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={onDelete}
                  variant="destructive"
                  className="w-full gap-2"
                  size="lg"
                  disabled={deleteLoading}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {deleteLoading ? "Eliminando..." : "Eliminar reporte"}
                </Button>
              )}
              {deleteError && (
                <p role="alert" className="text-sm text-destructive text-center">
                  {deleteError}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={onContact}
                className="w-full gap-2"
                size="lg"
                disabled={contactLoading}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {contactLoading ? "Abriendo chat..." : contactLabel}
              </Button>
              {contactError && (
                <p role="alert" className="text-sm text-destructive text-center">
                  {contactError}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PetDetailView;
