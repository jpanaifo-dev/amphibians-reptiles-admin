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

export const classService = {
    getAll: async (params?: SearchParams): Promise<ApiResponse<PaginatedResponse<ITaxonomyClass>>> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
        if (params?.query) searchParams.set('query', params.query);

        const url = `${API_ROUTES.TAXONOMY.CLASSES.GET_ADMIN}?${searchParams.toString()}`;
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
