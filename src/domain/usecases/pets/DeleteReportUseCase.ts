import type { PetRepository } from "../../ports/out/PetRepository";

export class DeleteReportUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute(id: string): Promise<void> {
    await this.petRepository.delete(id);
  }
}
