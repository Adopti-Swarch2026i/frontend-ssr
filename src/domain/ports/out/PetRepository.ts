import type {
  PaginatedPets,
  Pet,
  PetFilters,
  PetStats,
} from "../../entities/Pet";
import type {
  CreateReportInput,
  UpdateReportInput,
} from "../../entities/Report";

export interface PetRepository {
  findAll(filters?: PetFilters): Promise<PaginatedPets>;
  findById(id: string): Promise<Pet>;
  create(input: CreateReportInput): Promise<Pet>;
  update(input: UpdateReportInput): Promise<Pet>;
  delete(id: string): Promise<void>;
  getStats(): Promise<PetStats>;
}
