import type { CustomFetch } from "../types/nuxt";
import type { ApiResponse } from "./useTypes";
import { useNuxtApp, useRuntimeConfig } from "nuxt/app";
import { useAuth } from "./useAuth";

export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  phone: string;
  crunchId?: string;
  role?: string;
  password?: string;
}

export const useUser = () => {
  const config = useRuntimeConfig();
  const { access_token } = useAuth();

  const { $customFetch } = useNuxtApp() as unknown as {
    $customFetch: CustomFetch;
  };

  const authHeaders = () => ({
    "Content-Type": "application/json",
    ...(access_token.value
      ? { Authorization: `Bearer ${access_token.value}` }
      : {}),
  });

  const createPastor = async (
    user: Pick<UserDTO, "name" | "email" | "phone" | "password">,
  ): Promise<ApiResponse<{ id: string }>> => {
    return await $customFetch(
      `${config.public.URL_BACKEND}/api/pastor/signup`,
      {
        method: "POST",
        headers: authHeaders(),
        body: user,
      },
    );
  };

  const createUser = async (
    user: Omit<UserDTO, "id">,
  ): Promise<ApiResponse<{ id: string }>> => {
    return await $customFetch(`${config.public.URL_BACKEND}/api/user/create`, {
      method: "POST",
      headers: authHeaders(),
      body: user,
    });
  };

  const getAllUsers = async (): Promise<ApiResponse<UserDTO[]>> => {
    return await $customFetch(`${config.public.URL_BACKEND}/api/user/getAll`, {
      method: "GET",
      headers: authHeaders(),
    });
  };

  const getUserById = async (id: string): Promise<ApiResponse<UserDTO>> => {
    return await $customFetch(`${config.public.URL_BACKEND}/api/user/getById`, {
      method: "POST",
      headers: authHeaders(),
      body: { id },
    });
  };

  const updateUser = async (user: UserDTO): Promise<ApiResponse<void>> => {
    return await $customFetch(`${config.public.URL_BACKEND}/api/user/update`, {
      method: "POST",
      headers: authHeaders(),
      body: user,
    });
  };

  const deleteUser = async (id: string): Promise<ApiResponse<void>> => {
    return await $customFetch(`${config.public.URL_BACKEND}/api/user/delete`, {
      method: "DELETE",
      headers: authHeaders(),
      body: { id },
    });
  };

  return {
    createPastor,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  };
};
