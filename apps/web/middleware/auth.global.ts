export default defineNuxtRouteMiddleware(async (to) => {
  const { error } = await useCustomFetch('/auth/verify');

  if (to.path === '/login') {
    if (!error.value) {
      return navigateTo(`/`, {
        replace: true,
        redirectCode: 307,
      });
    }
    return;
  }

  if (error.value?.statusCode === 401) {
    const params = new URLSearchParams([['redirect', to.fullPath]]);
    return navigateTo(`/login?${params.toString()}`, {
      replace: true,
      redirectCode: 307,
    });
  }
});
