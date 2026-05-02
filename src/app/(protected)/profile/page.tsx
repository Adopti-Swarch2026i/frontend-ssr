import { ProfilePage } from "@/adapters/in/pages/ProfilePage";
import { petApiServer } from "@/adapters/out/api/PetApiServerAdapter";
import { verifySession } from "@/lib/session";
import type { Pet } from "@/domain/entities/Pet";

export default async function Page() {
  const session = await verifySession();
  let initialPets: Pet[] = [];

  if (session?.uid) {
    try {
      const result = await petApiServer.findAll({
        reporterId: session.uid,
        page: 1,
        pageSize: 50,
      });
      initialPets = result.results;
    } catch {
      initialPets = [];
    }
  }

  return <ProfilePage initialPets={initialPets} />;
}
