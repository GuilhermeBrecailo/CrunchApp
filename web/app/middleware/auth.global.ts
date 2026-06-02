import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "#app";
import { useAuth } from "../../composables/useAuth";

const publicRoutes = ["/login", "/register", "/forgot-password"];
const onboardingRoutes = ["/onboarding/church"];
const noChurchAllowedRoutes = ["/", "/user", "/admin", ...onboardingRoutes];
const refreshCookieName = "refresh_token";

export default defineNuxtRouteMiddleware(async (to) => {
  const isPublicRoute = publicRoutes.some(
    (route) => to.path === route || to.path.startsWith(`${route}/`),
  );

  if (import.meta.server) {
    const hasRefreshCookie = Boolean(useCookie(refreshCookieName).value);

    if (!isPublicRoute && !hasRefreshCookie) {
      return navigateTo({
        path: "/login",
        query:
          to.fullPath === "/"
            ? undefined
            : {
                redirect: to.fullPath,
              },
      });
    }

    return;
  }

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
