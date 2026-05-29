// types/nuxt.d.ts
import type { FetchOptions } from "ofetch";
import type { ApiResponse } from "../composables/useTypes";

export interface CustomFetch {
  <T = any>(url: string, options?: FetchOptions): Promise<ApiResponse<T>>;
}

declare module "#app" {
  interface NuxtApp {
    $customFetch: CustomFetch;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $customFetch: CustomFetch;
  }
}
