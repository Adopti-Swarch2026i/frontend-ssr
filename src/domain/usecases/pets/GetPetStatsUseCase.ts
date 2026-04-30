import type { PetRepository } from "../../ports/out/PetRepository";
import type { PetStats } from "../../entities/Pet";

export class GetPetStatsUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute(): Promise<PetStats> {
    return this.petRepository.getStats();
  }
}
