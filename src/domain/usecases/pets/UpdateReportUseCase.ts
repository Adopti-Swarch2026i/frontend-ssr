import type { PetRepository } from "../../ports/out/PetRepository";
import type { Pet } from "../../entities/Pet";
import type { UpdateReportInput } from "../../entities/Report";

export class UpdateReportUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute(input: UpdateReportInput): Promise<Pet> {
    return this.petRepository.update(input);
  }
}
