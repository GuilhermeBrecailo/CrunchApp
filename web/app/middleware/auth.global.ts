import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuth } from "../../composables/useAuth";

const publicRoutes = ["/login", "/register", "/forgot-password"];

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const isPublicRoute = publicRoutes.some(
    (route) => to.path === route || to.path.startsWith(`${route}/`),
  );

  const { access_token, session, should_refresh } = useAuth();

  if (isPublicRoute) {
    if (access_token.value && to.path === "/login") {
      return navigateTo("/");
    }

    return;
  }

  if (!access_token.value || should_refresh()) {
    await session();
  }

  if (!access_token.value) {
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
