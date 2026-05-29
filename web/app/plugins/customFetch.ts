import { defineNuxtPlugin } from "#app";
import type { FetchOptions } from "ofetch";
import type { ApiResponse } from "../../composables/useTypes";

export default defineNuxtPlugin(() => {
  const customFetch = async <T = unknown>(
    url: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await $fetch<ApiResponse<T> | T>(url, options);

      if (
        response &&
        typeof response === "object" &&
        ("data" in response || "error" in response || "status" in response)
      ) {
        return response as ApiResponse<T>;
      }

      return {
        data: response as T,
        status: 200,
      };
    } catch (error: any) {
      const response = error?.response?._data;

      return {
        data: response?.data,
        error: response?.error || error?.message || "Erro ao chamar a API",
        status: response?.status || error?.response?.status || 500,
      };
    }
  };

  return {
    provide: {
      customFetch,
    },
  };
});
