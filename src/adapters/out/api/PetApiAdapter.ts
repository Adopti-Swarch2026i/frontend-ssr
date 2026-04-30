import type { AxiosInstance } from "axios";
import type { PetRepository } from "@/domain/ports/out/PetRepository";
import type {
  PaginatedPets,
  Pet,
  PetFilters,
  PetStats,
} from "@/domain/entities/Pet";
import type {
  CreateReportInput,
  UpdateReportInput,
} from "@/domain/entities/Report";

interface BackendPet {
  id: number;
  name: string;
  type: string;
  breed: string | null;
  color: string | null;
  age: string | null;
  image_urls: string[] | null;
}

interface BackendReport {
  id: number;
  status: string;
  location: string;
  city: string;
  description: string;
  owner_name: string | null;
  owner_phone: string | null;
  owner_id: string;
  created_at: string;
  pet: BackendPet;
}

interface PaginatedResponse {
  total: number;
  page: number;
  page_size: number;
  results: BackendReport[];
}

export function mapReportToPet(report: BackendReport): Pet {
  return {
    id: String(report.id),
    name: report.pet.name,
    species: report.pet.type as Pet["species"],
    breed: report.pet.breed ?? "",
    color: report.pet.color ?? "",
    age: report.pet.age ?? "",
    description: report.description,
    status: report.status as Pet["status"],
    imageUrls: report.pet.image_urls ?? [],
    location: report.location,
    city: report.city,
    date: report.created_at,
    reporterId: report.owner_id,
    reporterName: report.owner_name ?? "",
    contactPhone: report.owner_phone ?? undefined,
    createdAt: report.created_at,
    updatedAt: report.created_at,
  };
}

export class PetApiAdapter implements PetRepository {
  constructor(private http: AxiosInstance) {}

  async findAll(filters?: PetFilters): Promise<PaginatedPets> {
    const params: Record<string, string | number> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.species) params.type = filters.species;
    if (filters?.city) params.city = filters.city;
    if (filters?.search) params.search = filters.search;
    if (filters?.reporterId) params.owner_id = filters.reporterId;
    if (filters?.page) params.page = filters.page;
    if (filters?.pageSize) params.page_size = filters.pageSize;

    const { data } = await this.http.get<PaginatedResponse>("/pets", { params });
    return {
      results: data.results.map(mapReportToPet),
      total: data.total,
      page: data.page,
      pageSize: data.page_size,
    };
  }

  async findById(id: string): Promise<Pet> {
    const { data } = await this.http.get<BackendReport>(`/pets/${id}`);
    return mapReportToPet(data);
  }

  async create(input: CreateReportInput): Promise<Pet> {
    const imageUrls = await this.uploadImages(input.images);
    const body = {
      name: input.name,
      type: input.species,
      breed: input.breed || null,
      color: input.color || null,
      age: input.age || null,
      status: input.status,
      location: input.location,
      city: input.city,
      description: input.description,
      owner_phone: input.contactPhone || null,
      image_urls: imageUrls,
    };
    const { data } = await this.http.post<BackendReport>("/pets", body);
    return mapReportToPet(data);
  }

  async update(input: UpdateReportInput): Promise<Pet> {
    const { id, images, imageUrls: keptUrls, ...rest } = input;
    const newUrls = images?.length ? await this.uploadImages(images) : [];
    const imageUrls = [...(keptUrls ?? []), ...newUrls];
    const body = {
      name: rest.name,
      type: rest.species,
      breed: rest.breed || null,
      color: rest.color || null,
      age: rest.age || null,
      status: rest.status,
      location: rest.location,
      city: rest.city,
      description: rest.description,
      owner_phone: rest.contactPhone || null,
      image_urls: imageUrls,
    };
    const { data } = await this.http.put<BackendReport>(`/pets/${id}`, body);
    return mapReportToPet(data);
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/pets/${id}`);
  }

  async getStats(): Promise<PetStats> {
    const { data } = await this.http.get<{
      lost: number;
      found: number;
      reunited: number;
    }>("/pets/stats");
    return {
      totalLost: data.lost,
      totalFound: data.found,
      totalReunited: data.reunited,
    };
  }

  private async uploadImages(files: File[]): Promise<string[]> {
    if (!files.length) return [];
    const uploads = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await this.http.post<{ image_url: string }>(
        "/pets/upload-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data.image_url;
    });
    return Promise.all(uploads);
  }
}
