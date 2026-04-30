import { useState, useCallback } from "react";
import { useDependencies } from "@/context/DependencyContext";
import type { Pet, PetFilters, PetStats } from "@/domain/entities/Pet";
import type {
  CreateReportInput,
  UpdateReportInput,
} from "@/domain/entities/Report";
import { ListPetsUseCase } from "@/domain/usecases/pets/ListPetsUseCase";
import { GetPetDetailUseCase } from "@/domain/usecases/pets/GetPetDetailUseCase";
import { CreateReportUseCase } from "@/domain/usecases/pets/CreateReportUseCase";
import { UpdateReportUseCase } from "@/domain/usecases/pets/UpdateReportUseCase";
import { DeleteReportUseCase } from "@/domain/usecases/pets/DeleteReportUseCase";
import { GetPetStatsUseCase } from "@/domain/usecases/pets/GetPetStatsUseCase";

export function usePets() {
  const { petRepository } = useDependencies();
  const [pets, setPets] = useState<Pet[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listPets = useCallback(
    async (filters?: PetFilters) => {
      setLoading(true);
      setError(null);
      try {
        const useCase = new ListPetsUseCase(petRepository);
        const result = await useCase.execute(filters);
        setPets(result.results);
        setTotal(result.total);
        setPage(result.page);
        setPageSize(result.pageSize);
        return result.results;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar mascotas"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [petRepository]
  );

  const getPetById = useCallback(
    async (id: string): Promise<Pet | null> => {
      setLoading(true);
      setError(null);
      try {
        const useCase = new GetPetDetailUseCase(petRepository);
        return await useCase.execute(id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar mascota"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [petRepository]
  );

  const createReport = useCallback(
    async (input: CreateReportInput): Promise<Pet | null> => {
      setLoading(true);
      setError(null);
      try {
        const useCase = new CreateReportUseCase(petRepository);
        return await useCase.execute(input);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al crear reporte"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [petRepository]
  );

  const updateReport = useCallback(
    async (input: UpdateReportInput): Promise<Pet | null> => {
      setLoading(true);
      setError(null);
      try {
        const useCase = new UpdateReportUseCase(petRepository);
        const updated = await useCase.execute(input);
        setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        return updated;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al actualizar reporte"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [petRepository]
  );

  const deleteReport = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const useCase = new DeleteReportUseCase(petRepository);
        await useCase.execute(id);
        setPets((prev) => prev.filter((p) => p.id !== id));
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al eliminar reporte"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [petRepository]
  );

  const getStats = useCallback(async (): Promise<PetStats | null> => {
    try {
      const useCase = new GetPetStatsUseCase(petRepository);
      return await useCase.execute();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar estadísticas"
      );
      return null;
    }
  }, [petRepository]);

  return {
    pets,
    total,
    page,
    pageSize,
    loading,
    error,
    listPets,
    getPetById,
    createReport,
    updateReport,
    deleteReport,
    getStats,
  };
}
