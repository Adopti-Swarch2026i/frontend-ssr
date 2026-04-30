"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Pencil, Phone, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import { usePets } from "@/adapters/in/hooks/usePets";
import { PetGrid } from "@/adapters/in/components/pets/PetGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/domain/entities/User";

// ─── Schema ────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  displayName: z.string().min(1, "El nombre es requerido"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ─── Stat Chip ──────────────────────────────────────────────────────────────

interface StatChipProps {
  label: string;
  value: number;
  color: string;
}

function StatChip({ label, value, color }: StatChipProps) {
  return (
    <div className="flex flex-col items-center px-5 py-2">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}

// ─── Cover + Avatar + Stats ─────────────────────────────────────────────────

interface ProfileHeroProps {
  user: User;
  totalPets: number;
  lostCount: number;
  foundCount: number;
  reunitedCount: number;
}

function ProfileHero({ user, totalPets, lostCount, foundCount, reunitedCount }: ProfileHeroProps) {
  const initials = user.displayName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <section className="relative">
      {/* Cover banner */}
      <div
        className="h-40 md:h-52 w-full rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 60%, hsl(var(--secondary-foreground)) 100%)",
        }}
        aria-hidden="true"
      >
        {/* Paw pattern overlay */}
        <div className="paw-bg-pattern w-full h-full opacity-10" />
      </div>

      {/* Avatar — overlaps the cover */}
      <div className="absolute -bottom-10 left-6 md:left-8">
        <div
          className="rounded-full p-1"
          style={{ background: "hsl(var(--background))" }}
        >
          <Avatar className="h-20 w-20 md:h-24 md:w-24 shadow-lg">
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback
              className="text-2xl font-bold"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats row — bottom right of cover */}
      <div className="absolute -bottom-10 right-0 flex items-center divide-x divide-border rounded-2xl border border-border bg-card shadow-md">
        <StatChip label="Reportes" value={totalPets} color="text-foreground" />
        <StatChip label="Perdidas" value={lostCount} color="text-[hsl(var(--status-lost))]" />
        <StatChip label="Encontradas" value={foundCount} color="text-[hsl(var(--status-found))]" />
        <StatChip label="Reunidas" value={reunitedCount} color="text-[hsl(var(--status-reunited))]" />
      </div>
    </section>
  );
}

// ─── Edit Form ───────────────────────────────────────────────────────────────

interface EditFormProps {
  user: User;
  onSave: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
}

function EditForm({ user, onSave, onCancel }: EditFormProps) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user.displayName ?? "",
      phone: user.phone ?? "",
    },
  });

  const handleSave = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="displayName">Nombre</Label>
        <Input
          id="displayName"
          {...register("displayName")}
          aria-invalid={!!errors.displayName}
        />
        {errors.displayName && (
          <p role="alert" className="text-xs text-destructive">
            {errors.displayName.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">
          Teléfono{" "}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+57 300 123 4567"
          {...register("phone")}
        />
      </div>
      <footer className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={saving} className="gap-1.5 cursor-pointer">
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
          {saving ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="gap-1.5 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Cancelar
        </Button>
      </footer>
    </form>
  );
}

// ─── Info Display ─────────────────────────────────────────────────────────────

interface InfoDisplayProps {
  user: User;
  onEdit: () => void;
}

function InfoDisplay({ user, onEdit }: InfoDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground leading-tight">
            {user.displayName}
          </h2>
          <p className="text-sm text-muted-foreground">Miembro de Adopti</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="gap-1.5 shrink-0 cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Editar
        </Button>
      </div>

      <dl className="space-y-2.5">
        <div className="flex items-center gap-3 text-sm">
          <dt>
            <Mail className="h-4 w-4 text-muted-foreground" aria-label="Email" />
          </dt>
          <dd className="text-foreground">{user.email}</dd>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <dt>
            <Phone className="h-4 w-4 text-muted-foreground" aria-label="Teléfono" />
          </dt>
          <dd className={user.phone ? "text-foreground" : "text-muted-foreground italic"}>
            {user.phone ?? "Sin teléfono registrado"}
          </dd>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <dt>
            <MapPin className="h-4 w-4 text-muted-foreground" aria-label="Ciudad" />
          </dt>
          <dd className="text-muted-foreground italic">Sin ciudad registrada</dd>
        </div>
      </dl>
    </div>
  );
}

// ─── Info Card (container) ────────────────────────────────────────────────────

interface ProfileInfoCardProps {
  user: User;
}

function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  const { updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);

  const handleSave = async (data: ProfileFormData) => {
    await updateProfile(data);
    setEditing(false);
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5 transition-all duration-200">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Información personal
      </h3>
      {editing ? (
        <EditForm user={user} onSave={handleSave} onCancel={() => setEditing(false)} />
      ) : (
        <InfoDisplay user={user} onEdit={() => setEditing(true)} />
      )}
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { user } = useAuth();
  const { pets, loading, listPets } = usePets();

  useEffect(() => {
    if (user?.id) listPets({ reporterId: user.id });
  }, [user?.id, listPets]);

  if (!user) return null;

  const lostCount = pets.filter((p) => p.status === "lost").length;
  const foundCount = pets.filter((p) => p.status === "found").length;
  const reunitedCount = pets.filter((p) => p.status === "reunited").length;

  return (
    <main className="space-y-12 animate-fade-in">
      {/* Hero: cover + avatar + stats */}
      <ProfileHero
        user={user}
        totalPets={pets.length}
        lostCount={lostCount}
        foundCount={foundCount}
        reunitedCount={reunitedCount}
      />

      {/* Spacer for avatar overlap */}
      <div className="pt-6" aria-hidden="true" />

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1">
          <ProfileInfoCard user={user} />
        </aside>

        <section className="lg:col-span-2 space-y-5">
          <header>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Mis reportes
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Mascotas que has reportado como perdidas o encontradas.
            </p>
          </header>

          {!loading && pets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 py-16 text-center">
              <p className="text-muted-foreground text-sm">
                Aún no has publicado ningún reporte.
              </p>
            </div>
          ) : (
            <PetGrid pets={pets} loading={loading} />
          )}
        </section>
      </div>
    </main>
  );
}
