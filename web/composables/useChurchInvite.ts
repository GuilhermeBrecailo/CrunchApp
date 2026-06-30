import type { CustomFetch } from "../types/nuxt";
import type { ApiResponse } from "./useTypes";
import { useNuxtApp, useRuntimeConfig } from "#app";
import { useAuth } from "./useAuth";

export function useChurchInvite() {
  const { $customFetch } = useNuxtApp() as unknown as { $customFetch: CustomFetch };
  const config = useRuntimeConfig();
  const { authHeaders } = useAuth();

  const getInviteCode = async (): Promise<ApiResponse<{ inviteCode: string }>> => {
    return await $customFetch<{ inviteCode: string }>(
      `${config.public.URL_BACKEND}/api/church/invite-code`,
      { method: "GET", headers: authHeaders() },
    );
  };

  const regenerateInviteCode = async (): Promise<ApiResponse<{ inviteCode: string }>> => {
    return await $customFetch<{ inviteCode: string }>(
      `${config.public.URL_BACKEND}/api/church/invite-code/regenerate`,
      { method: "POST", headers: authHeaders() },
    );
  };

  const joinByCode = async (inviteCode: string): Promise<ApiResponse<{ success: boolean; churchName: string }>> => {
    return await $customFetch<{ success: boolean; churchName: string }>(
      `${config.public.URL_BACKEND}/api/church/join`,
      { method: "POST", headers: authHeaders(), body: { inviteCode } },
    );
  };

  return { getInviteCode, regenerateInviteCode, joinByCode };
}
