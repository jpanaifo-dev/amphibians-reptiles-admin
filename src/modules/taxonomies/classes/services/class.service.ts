import { httpClient } from '@/lib/api-client';
import { API_ROUTES } from '@/config/api-routes';
import type {
    ITaxonomyClass,
    CreateClassDto,
    UpdateClassDto,
    PaginatedResponse,
    SearchParams,
    ApiResponse
} from '@/lib/definitions';
import { buildSearchParams } from '@/lib/utils';

export const classService = {
    getAll: async (params?: SearchParams & { name?: string; status?: number }): Promise<PaginatedResponse<ITaxonomyClass>> => {
        const queryParams = buildSearchParams(params || {});
        const url = `${API_ROUTES.TAXONOMY.CLASSES.GET_ADMIN}?${queryParams.toString()}`;
        return httpClient.get(url);
    },

    getById: async (id: number): Promise<ApiResponse<ITaxonomyClass>> => {
        return httpClient.get(API_ROUTES.TAXONOMY.CLASSES.GET_BY_ID(id));
    },

    create: async (data: CreateClassDto): Promise<ApiResponse<ITaxonomyClass>> => {
        return httpClient.post(API_ROUTES.TAXONOMY.CLASSES.CREATE, data);
    },

    update: async (id: number, data: UpdateClassDto): Promise<ApiResponse<ITaxonomyClass>> => {
        return httpClient.patch(API_ROUTES.TAXONOMY.CLASSES.UPDATE(id), data);
    },

    delete: async (id: number): Promise<ApiResponse<void>> => {
        return httpClient.delete(API_ROUTES.TAXONOMY.CLASSES.DELETE(id));
    }
};
