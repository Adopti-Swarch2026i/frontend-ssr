import Link from "next/link";

export default function Unauthorized() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-heading text-4xl">401 — No autorizado</h1>
      <p className="text-muted-foreground max-w-md">
        Tu sesión no es válida o ha expirado. Inicia sesión de nuevo para
        continuar.
      </p>
      <Link
        href="/login"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Iniciar sesión
      </Link>
    </main>
  );
}
