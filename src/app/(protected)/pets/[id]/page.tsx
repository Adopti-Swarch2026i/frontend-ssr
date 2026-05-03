import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PetDetailPage } from "@/adapters/in/pages/PetDetailPage";
import { petApiServer } from "@/adapters/out/api/PetApiServerAdapter";
import {
  matchesApiServer,
  type MatchSuggestion,
} from "@/adapters/out/api/MatchesApiServerAdapter";
import { NotFoundError } from "@/adapters/out/api/errors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const pet = await petApiServer.findById(id);
    return {
      title: `${pet.name} (${pet.status}) — Adopti`,
      description:
        pet.description?.slice(0, 160) ??
        `Reporte ${pet.status} de ${pet.species} en ${pet.city}`,
    };
  } catch {
    return { title: "Mascota — Adopti" };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const pet = await petApiServer.findById(id);
    let matches: MatchSuggestion[] = [];
    const numericId = Number(pet.id);
    if (!Number.isNaN(numericId) && pet.status !== "reunited") {
      // pet.id en el frontend == report.id en el backend (ver mapReportToPet).
      matches = await matchesApiServer.getSuggestions(numericId, numericId);
    }
    return <PetDetailPage initialPet={pet} initialMatches={matches} />;
  } catch (err) {
    if (err instanceof NotFoundError) {
      notFound();
    }
    return <PetDetailPage initialPet={null} initialMatches={[]} />;
  }
}
