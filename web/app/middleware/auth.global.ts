import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuth } from "../../composables/useAuth";

const publicRoutes = ["/login", "/register", "/forgot-password"];
const onboardingRoutes = ["/onboarding/church"];
const noChurchAllowedRoutes = ["/", "/user", "/admin", ...onboardingRoutes];

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const isPublicRoute = publicRoutes.some(
    (route) => to.path === route || to.path.startsWith(`${route}/`),
  );

  const { access_token, user, session, should_refresh, fetchMe } = useAuth();

  if (isPublicRoute) {
    if (access_token.value) {
      return navigateTo("/");
    }

    return;
  }

  let needsSession = !access_token.value;

  if (access_token.value) {
    try {
      needsSession = should_refresh();
    } catch {
      needsSession = true;
    }
  }

  if (needsSession) {
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

  if (!user.value?.id) {
    await fetchMe();
  }

  if (!user.value?.id) {
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }

  const isOnboardingRoute = onboardingRoutes.some(
    (route) => to.path === route || to.path.startsWith(`${route}/`),
  );

  const isNoChurchAllowedRoute = noChurchAllowedRoutes.some(
    (route) =>
      to.path === route || (route !== "/" && to.path.startsWith(`${route}/`)),
  );

  if (!user.value?.hasChurch && !isNoChurchAllowedRoute) {
    return navigateTo("/");
  }

  if (user.value?.mustChangePassword && to.path !== "/user") {
    return navigateTo("/user");
  }

  if (user.value?.hasChurch && isOnboardingRoute) {
    return navigateTo("/");
  }
});
