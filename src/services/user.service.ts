/**
 * @file User Service
 * @description Handles all user management API calls.
 */

import { httpClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type {
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedResponse,
  SearchParams,
  ApiResponse,
} from "@/lib/definitions";

/**
 * User management service
 */
export const userService = {
  /**
   * Get all users with optional pagination
   * @param params - Query parameters for filtering and pagination
   * @returns List of users
   * @example
   * ```ts
   * const users = await userService.getAll({ page: 1, pageSize: 10 });
   * ```
   */
  async getAll(
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.pageSize)
      searchParams.set("pageSize", params.pageSize.toString());
    if (params?.query) searchParams.set("query", params.query);
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const url = `${API_ROUTES.USERS.GET_ALL}?${searchParams.toString()}`;
    return httpClient.get<ApiResponse<PaginatedResponse<User>>>(url);
  },

  /**
   * Get user by ID
   * @param id - User ID
   * @returns User data
   */
  async getById(id: string | number): Promise<ApiResponse<User>> {
    return httpClient.get<ApiResponse<User>>(API_ROUTES.USERS.GET_BY_ID(id));
  },

  /**
   * Create new user
   * @param data - User creation data
   * @returns Created user
   * @example
   * ```ts
   * const newUser = await userService.create({
   *   username: 'johndoe',
   *   email: 'john@example.com',
   *   password: 'secret123',
   *   role: 'BASIC_USER'
   * });
   * ```
   */
  async create(data: CreateUserData): Promise<ApiResponse<User>> {
    return httpClient.post<ApiResponse<User>>(API_ROUTES.USERS.CREATE, data);
  },

  /**
   * Update existing user
   * @param id - User ID
   * @param data - Updated user data
   * @returns Updated user
   */
  async update(
    id: string | number,
    data: UpdateUserData
  ): Promise<ApiResponse<User>> {
    return httpClient.put<ApiResponse<User>>(API_ROUTES.USERS.UPDATE(id), data);
  },

  /**
   * Partially update user
   * @param id - User ID
   * @param data - Partial user data to update
   * @returns Updated user
   */
  async patch(
    id: string | number,
    data: Partial<UpdateUserData>
  ): Promise<ApiResponse<User>> {
    return httpClient.patch<ApiResponse<User>>(
      API_ROUTES.USERS.UPDATE(id),
      data
    );
  },

  /**
   * Delete user
   * @param id - User ID
   * @returns Success response
   */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return httpClient.delete<ApiResponse<void>>(API_ROUTES.USERS.DELETE(id));
  },

  /**
   * Search users
   * @param query - Search query
   * @returns Matching users
   */
  async search(query: string): Promise<ApiResponse<User[]>> {
    return httpClient.get<ApiResponse<User[]>>(
      `${API_ROUTES.USERS.SEARCH}?q=${encodeURIComponent(query)}`
    );
  },

  /**
   * Upload user avatar (multipart/form-data example)
   * @param id - User ID
   * @param file - Avatar file
   * @returns Updated user
   * @example
   * ```ts
   * const formData = new FormData();
   * formData.append('avatar', file);
   * const updated = await userService.uploadAvatar(userId, formData);
   * ```
   */
  async uploadAvatar(
    id: string | number,
    formData: FormData
  ): Promise<ApiResponse<User>> {
    return httpClient.post<ApiResponse<User>>(
      `${API_ROUTES.USERS.UPDATE(id)}/avatar`,
      formData
    );
  },
};
