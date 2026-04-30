import type { PetSpecies, PetStatus } from "./Pet";

export interface CreateReportInput {
  name: string;
  species: PetSpecies;
  breed: string;
  color: string;
  age: string;
  description: string;
  status: PetStatus;
  images: File[];
  imageUrls?: string[];
  location: string;
  city: string;
  date: string;
  contactPhone?: string;
}

export interface UpdateReportInput extends Partial<CreateReportInput> {
  id: string;
}
