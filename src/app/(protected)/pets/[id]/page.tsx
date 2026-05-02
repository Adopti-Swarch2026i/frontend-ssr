import { notFound } from "next/navigation";
import { PetDetailPage } from "@/adapters/in/pages/PetDetailPage";
import { petApiServer } from "@/adapters/out/api/PetApiServerAdapter";
import { NotFoundError } from "@/adapters/out/api/errors";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const pet = await petApiServer.findById(id);
    return <PetDetailPage initialPet={pet} />;
  } catch (err) {
    if (err instanceof NotFoundError) {
      notFound();
    }
    return <PetDetailPage initialPet={null} />;
  }
}
