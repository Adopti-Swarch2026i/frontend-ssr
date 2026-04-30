import type { PetRepository } from "../../ports/out/PetRepository";
import type { Pet } from "../../entities/Pet";
import type { CreateReportInput } from "../../entities/Report";

export class CreateReportUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute(input: CreateReportInput): Promise<Pet> {
    return this.petRepository.create(input);
  }
}
