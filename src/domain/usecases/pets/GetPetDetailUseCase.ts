import type { PetRepository } from "../../ports/out/PetRepository";
import type { Pet } from "../../entities/Pet";

export class GetPetDetailUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute(id: string): Promise<Pet> {
    return this.petRepository.findById(id);
  }
}
