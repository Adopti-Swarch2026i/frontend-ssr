import type { PetRepository } from "../../ports/out/PetRepository";
import type { PaginatedPets, PetFilters } from "../../entities/Pet";

export class ListPetsUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute(filters?: PetFilters): Promise<PaginatedPets> {
    return this.petRepository.findAll(filters);
  }
}
