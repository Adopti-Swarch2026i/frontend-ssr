export type PetSpecies = "dog" | "cat" | "bird" | "other";
export type PetStatus = "lost" | "found" | "reunited";

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  color: string;
  age: string;
  description: string;
  status: PetStatus;
  imageUrls: string[];
  location: string;
  city: string;
  date: string;
  reporterId: string;
  reporterName: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetFilters {
  status?: PetStatus;
  species?: string;
  city?: string;
  search?: string;
  reporterId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedPets {
  results: Pet[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PetStats {
  totalLost: number;
  totalFound: number;
  totalReunited: number;
}
