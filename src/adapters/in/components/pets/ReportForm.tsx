"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  SearchCheck,
  MapPin,
  Clock,
  ImagePlus,
  X,
  CircleAlert,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, StatusStrip } from "./StatusBadge";
import type { CreateReportInput } from "@/domain/entities/Report";

const reportSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  species: z.enum(["dog", "cat", "bird", "other"]),
  breed: z.string(),
  color: z.string().min(1, "Color requerido"),
  age: z.string(),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  status: z.enum(["lost", "found", "reunited"]),
  location: z.string().min(1, "Ubicación requerida"),
  city: z.string().min(1, "Ciudad requerida"),
  date: z.string().min(1, "Fecha requerida"),
  contactPhone: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export interface ReportFormInitialData
  extends Partial<Omit<CreateReportInput, "images" | "imageUrls">> {
  imageUrls?: string[];
}

interface ReportFormProps {
  onSubmit: (data: CreateReportInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode?: "create" | "edit";
  initialData?: ReportFormInitialData;
  submitLabel?: string;
  submittingLabel?: string;
  allowReunited?: boolean;
}

const speciesLabels: Record<string, string> = {
  dog: "Perro",
  cat: "Gato",
  bird: "Ave",
  other: "Otro",
};

const selectClass =
  "flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm " +
  "text-foreground ring-offset-background cursor-pointer transition-colors " +
  "hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const MAX_IMAGES = 5;

interface ImageItem {
  src: string;
  remote: boolean;
  file?: File;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-destructive mt-1">
      {message}
    </p>
  );
}

function LivePreview({ data, imagePreviews }: { data: ReportFormData; imagePreviews: string[] }) {
  const speciesLabel = speciesLabels[data.species] ?? data.species;
  const hasContent = data.name || data.city || data.description;
  const previewImage = imagePreviews[0];

  return (
    <div className="sticky top-24">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
        Vista previa
      </p>
      <article className="relative overflow-hidden rounded-sm bg-muted aspect-[3/4]">
        <StatusStrip status={data.status} />

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={data.status} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-display text-2xl font-bold text-white leading-tight">
            {data.name || "Nombre de mascota"}
          </h3>
          <p className="text-[11px] uppercase tracking-widest text-white/60 font-medium mt-0.5">
            {speciesLabel}
            {data.breed && ` · ${data.breed}`}
          </p>
          {(data.city || data.location) && (
            <div className="flex items-center gap-1 mt-2 text-xs text-white/50">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {[data.location, data.city].filter(Boolean).join(", ")}
            </div>
          )}
          {data.date && (
            <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {data.date}
            </div>
          )}
          {data.description && (
            <p className="text-xs text-white/40 mt-2 line-clamp-2">
              {data.description}
            </p>
          )}
        </div>

        {!hasContent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-white/30 italic font-display">
              Completa el formulario...
            </p>
          </div>
        )}
      </article>
    </div>
  );
}

function toDateInputValue(value?: string): string {
  if (!value) return new Date().toISOString().split("T")[0];
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  return d.toISOString().split("T")[0];
}

export function ReportForm({
  onSubmit,
  onCancel,
  loading,
  mode = "create",
  initialData,
  submitLabel,
  submittingLabel,
  allowReunited,
}: ReportFormProps) {
  const isEdit = mode === "edit";
  const reunitedEnabled = allowReunited ?? isEdit;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      species: initialData?.species ?? "dog",
      breed: initialData?.breed ?? "",
      color: initialData?.color ?? "",
      age: initialData?.age ?? "",
      description: initialData?.description ?? "",
      status: initialData?.status ?? "lost",
      location: initialData?.location ?? "",
      city: initialData?.city ?? "",
      date: toDateInputValue(initialData?.date),
      contactPhone: initialData?.contactPhone ?? "",
    },
  });

  const watchedData = useWatch({ control }) as ReportFormData;

  const [images, setImages] = useState<ImageItem[]>(
    (initialData?.imageUrls ?? []).map((url) => ({ src: url, remote: true })),
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (!img.remote) URL.revokeObjectURL(img.src);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previews = images.map((img) => img.src);

  const scrollToFirstError = useCallback(() => {
    if (!formRef.current) return;
    const firstInvalid = formRef.current.querySelector<HTMLElement>(
      '[aria-invalid="true"], [role="alert"]',
    );
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length === 0) return;

      setImages((prev) => {
        const room = MAX_IMAGES - prev.length;
        const accepted = files.slice(0, Math.max(0, room));
        const added: ImageItem[] = accepted.map((file) => ({
          src: URL.createObjectURL(file),
          remote: false,
          file,
        }));
        return [...prev, ...added];
      });

      setImageError(null);
      setSubmitError(null);
      e.target.value = "";
    },
    [],
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target && !target.remote) URL.revokeObjectURL(target.src);
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setImageError("Agrega al menos una foto");
      return next;
    });
  }, []);

  const handleFormSubmit = async (data: ReportFormData) => {
    if (images.length === 0) {
      setImageError("Agrega al menos una foto");
      setSubmitError("Agrega al menos una foto para publicar el reporte.");
      scrollToFirstError();
      return;
    }
    setImageError(null);
    setSubmitError(null);

    const newFiles = images.filter((i) => !i.remote && i.file).map((i) => i.file as File);
    const keptUrls = images.filter((i) => i.remote).map((i) => i.src);

    await onSubmit({
      ...data,
      images: newFiles,
      imageUrls: keptUrls,
    });
  };

  const handleInvalidSubmit = (fieldErrors: Record<string, unknown>) => {
    const errorCount = Object.keys(fieldErrors).length;
    setSubmitError(
      `Hay ${errorCount} campo${errorCount !== 1 ? "s" : ""} con errores. Revisa el formulario.`,
    );
    requestAnimationFrame(scrollToFirstError);
  };

  const defaultSubmit = isEdit ? "Guardar cambios" : "Publicar reporte";
  const defaultSubmitting = isEdit ? "Guardando..." : "Publicando...";

  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleFormSubmit, handleInvalidSubmit)}
        className="lg:col-span-3 space-y-10"
        noValidate
      >
        <fieldset className="space-y-4">
          <legend className="font-display text-2xl font-bold text-foreground">
            Tipo de reporte
          </legend>
          <div className="space-y-2">
            <label
              className={`flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-all ${
                watchedData.status === "lost"
                  ? "border-[hsl(var(--status-lost))] bg-[hsl(var(--status-lost-bg))]"
                  : "border-border hover:border-border/80"
              }`}
            >
              <input type="radio" value="lost" {...register("status")} className="sr-only" />
              <AlertTriangle
                className="h-5 w-5 shrink-0"
                style={{
                  color:
                    watchedData.status === "lost"
                      ? "hsl(var(--status-lost))"
                      : "hsl(var(--muted-foreground))",
                }}
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Mascota perdida</p>
                <p className="text-xs text-muted-foreground">
                  Perdí a mi mascota y necesito ayuda
                </p>
              </div>
            </label>
            <label
              className={`flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-all ${
                watchedData.status === "found"
                  ? "border-[hsl(var(--status-found))] bg-[hsl(var(--status-found-bg))]"
                  : "border-border hover:border-border/80"
              }`}
            >
              <input type="radio" value="found" {...register("status")} className="sr-only" />
              <SearchCheck
                className="h-5 w-5 shrink-0"
                style={{
                  color:
                    watchedData.status === "found"
                      ? "hsl(var(--status-found))"
                      : "hsl(var(--muted-foreground))",
                }}
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Mascota encontrada</p>
                <p className="text-xs text-muted-foreground">
                  Encontré una mascota y busco a su dueño
                </p>
              </div>
            </label>
            {reunitedEnabled && (
              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-all ${
                  watchedData.status === "reunited"
                    ? "border-[hsl(var(--status-reunited))] bg-[hsl(var(--status-reunited-bg))]"
                    : "border-border hover:border-border/80"
                }`}
              >
                <input type="radio" value="reunited" {...register("status")} className="sr-only" />
                <PartyPopper
                  className="h-5 w-5 shrink-0"
                  style={{
                    color:
                      watchedData.status === "reunited"
                        ? "hsl(var(--status-reunited))"
                        : "hsl(var(--muted-foreground))",
                  }}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-sm">Mascota reunida</p>
                  <p className="text-xs text-muted-foreground">
                    La mascota ya fue reunida con su familia
                  </p>
                </div>
              </label>
            )}
          </div>
        </fieldset>

        <div className="space-y-5">
          <h2 className="font-display text-2xl font-bold text-foreground">
            La mascota
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="¿Cómo se llama?" {...register("name")} aria-invalid={!!errors.name} />
              <FieldError message={errors.name?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="species">Especie</Label>
              <select id="species" {...register("species")} className={selectClass}>
                <option value="dog">Perro</option>
                <option value="cat">Gato</option>
                <option value="bird">Ave</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="breed">Raza <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Input id="breed" placeholder="Labrador, Siamés..." {...register("breed")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Color</Label>
              <Input id="color" placeholder="Negro, blanco, marrón..." {...register("color")} aria-invalid={!!errors.color} />
              <FieldError message={errors.color?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age">Edad <span className="text-muted-foreground font-normal">(aprox.)</span></Label>
              <Input id="age" placeholder="2 años" {...register("age")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" {...register("date")} aria-invalid={!!errors.date} />
              <FieldError message={errors.date?.message} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Fotos
          </h2>
          <div className="space-y-3">
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div
                    key={`${img.src}-${i}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                  >
                    <img src={img.src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label={`Eliminar foto ${i + 1}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-6 cursor-pointer transition-colors"
            >
              <ImagePlus className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">
                {previews.length === 0
                  ? "Haz click para subir fotos"
                  : `${previews.length}/${MAX_IMAGES} fotos — click para agregar más`}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleImageChange}
                disabled={previews.length >= MAX_IMAGES}
              />
            </label>
            <FieldError message={imageError ?? undefined} />
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Ubicación
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="location">Barrio o dirección</Label>
              <Input id="location" placeholder="Ej: Parque El Virrey" {...register("location")} aria-invalid={!!errors.location} />
              <FieldError message={errors.location?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" placeholder="Bogotá, Medellín..." {...register("city")} aria-invalid={!!errors.city} />
              <FieldError message={errors.city?.message} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Detalles
          </h2>
          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe la mascota, circunstancias, señas particulares..."
              rows={4}
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            <FieldError message={errors.description?.message} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactPhone">
              Teléfono <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input id="contactPhone" type="tel" placeholder="+57 300 123 4567" {...register("contactPhone")} />
          </div>
        </div>

        <footer className="space-y-3 pt-4 border-t border-border">
          {submitError && (
            <aside
              role="alert"
              className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
              {submitError}
            </aside>
          )}
          <nav className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading
                ? submittingLabel ?? defaultSubmitting
                : submitLabel ?? defaultSubmit}
            </Button>
          </nav>
        </footer>
      </form>

      <aside className="hidden lg:block lg:col-span-2">
        <LivePreview data={watchedData} imagePreviews={previews} />
      </aside>
    </section>
  );
}
