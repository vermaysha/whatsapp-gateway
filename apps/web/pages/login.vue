<script setup lang="ts">
definePageMeta({
  layout: 'guest',
});

useHead({
  title: 'Login',
});

const notifyStore = useNotifyStore();
const username = ref('');
const password = ref('');

/**
 * Asynchronous function that handles the login process.
 *
 * @return {Promise<void>} Returns a Promise that resolves when the login process is complete.
 */
async function login() {
  const { data, error } = await useCustomFetch('/auth/login', {
    body: {
      username: username.value,
      password: password.value,
    },
    method: 'post',
  });

  const route = useRoute();

  if (error.value?.data.message) {
    notifyStore.notify(error.value.data.message, NotificationType.Error);
  } else if (error.value) {
    notifyStore.notify(error.value, NotificationType.Error);
  }

  if (data.value) {
    const redirect: string | undefined = route.query.redirect as string;
    return navigateTo(redirect || '/');
  }
}
</script>

<template>
  <div
    class="grid grid-cols-1 grid-rows-1 h-screen max-h-screen xl:grid-cols-2"
  >
    <div class="hidden items-center justify-center border-r bg-neutral xl:flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-3/4 h-auto"
        viewBox="0 0 751.57 539.42"
      >
        <path
          fill="#fff"
          d="M19.9 538.23c0 .66.53 1.19 1.19 1.19h729.29c.66 0 1.19-.53 1.19-1.19s-.53-1.19-1.19-1.19H21.09c-.66 0-1.19.53-1.19 1.19z"
        ></path>
        <path
          fill="#e2e3e4"
          d="M253.43 95.15H19.53c-8.92 0-16.18-7.26-16.18-16.18s7.26-16.18 16.18-16.18h233.9c8.92 0 16.18 7.26 16.18 16.18s-7.26 16.18-16.18 16.18zM19.53 64.79c-7.82 0-14.18 6.36-14.18 14.18s6.36 14.18 14.18 14.18h233.9c7.82 0 14.18-6.36 14.18-14.18s-6.36-14.18-14.18-14.18H19.53z"
        ></path>
        <path
          fill="#3186c3"
          d="M253.43 284.5H19.53c-8.65 0-15.68-7.03-15.68-15.68s7.03-15.68 15.68-15.68h233.9c8.65 0 15.68 7.03 15.68 15.68s-7.03 15.68-15.68 15.68z"
        ></path>
        <path
          fill="#e2e3e4"
          d="M176.78 31.36H15.68C7.03 31.36 0 24.33 0 15.68S7.03 0 15.68 0h161.1c8.65 0 15.68 7.03 15.68 15.68s-7.03 15.68-15.68 15.68zM253.43 158.43H19.53c-8.92 0-16.18-7.26-16.18-16.18s7.26-16.18 16.18-16.18h233.9c8.92 0 16.18 7.26 16.18 16.18s-7.26 16.18-16.18 16.18zm-233.9-30.36c-7.82 0-14.18 6.36-14.18 14.18s6.36 14.18 14.18 14.18h233.9c7.82 0 14.18-6.36 14.18-14.18s-6.36-14.18-14.18-14.18H19.53zM253.43 221.72H19.53c-8.92 0-16.18-7.26-16.18-16.18s7.26-16.18 16.18-16.18h233.9c8.92 0 16.18 7.26 16.18 16.18s-7.26 16.18-16.18 16.18zm-233.9-30.36c-7.82 0-14.18 6.36-14.18 14.18s6.36 14.18 14.18 14.18h233.9c7.82 0 14.18-6.36 14.18-14.18s-6.36-14.18-14.18-14.18H19.53zM11.49 51.17h61.3c1.46 0 2.65 1.18 2.65 2.65 0 1.46-1.19 2.65-2.65 2.65h-61.3c-1.46 0-2.65-1.18-2.65-2.65 0-1.46 1.19-2.65 2.65-2.65zM11.49 115.95h61.3c1.46 0 2.65 1.18 2.65 2.64 0 1.46-1.19 2.65-2.65 2.65h-61.3c-1.46 0-2.65-1.18-2.65-2.64 0-1.46 1.19-2.65 2.65-2.65zM11.49 180.74h61.3a2.646 2.646 0 110 5.29h-61.3a2.646 2.646 0 110-5.29z"
        ></path>
        <path
          fill="#9f616a"
          d="M447.08 132.26L424.72 139.62 424.72 107.43 445.01 107.43 447.08 132.26z"
        ></path>
        <circle cx="427.49" cy="94.06" r="22.28" fill="#9f616a"></circle>
        <path
          fill="#2f2e43"
          d="M433.61 91.85c-3.73-.11-6.18-3.88-7.63-7.32s-2.94-7.39-6.4-8.81c-2.83-1.16-7.82 6.69-10.05 4.6-2.33-2.18-.06-13.37 2.41-15.38 2.47-2.01 5.85-2.4 9.03-2.55 7.76-.36 15.57.27 23.18 1.86 4.71.98 9.55 2.46 12.95 5.86 4.3 4.32 5.4 10.83 5.71 16.92.32 6.23-.04 12.75-3.07 18.2s-9.37 9.47-15.45 8.08c-.61-3.3.01-6.69.25-10.05.23-3.35-.01-6.97-2.06-9.64-2.04-2.67-6.42-3.73-8.8-1.36"
        ></path>
        <path
          fill="#2f2e43"
          d="M461.02 99.57c2.23-1.63 4.9-3 7.64-2.66 2.96.36 5.47 2.8 6.23 5.69s-.09 6.07-1.93 8.43c-1.83 2.36-4.56 3.92-7.44 4.7-1.67.45-3.5.64-5.09-.04-2.34-1.01-3.61-4-2.69-6.38"
        ></path>
        <path
          fill="#9f616a"
          d="M375.76 309.2c-1.49 7.32 1.24 14.01 6.08 14.94s9.97-4.26 11.45-11.58c.63-2.92.53-5.94-.29-8.82l18.43-114.75-23.05-4.34-8.9 116.5a18.38 18.38 0 00-3.72 8.06z"
        ></path>
        <path
          fill="#e2e3e4"
          d="M424.48 124.85h-15.73c-11.12 1.69-14.14 7.62-16.67 18.58-3.86 16.72-8.79 38.98-7.81 39.31 1.57.52 28.35 13.12 42 10.24l-1.79-68.13z"
        ></path>
        <path fill="#9f616a" d="M418.75 490.36H439.69V520.07H418.75z"></path>
        <path
          fill="#2f2e43"
          d="M398.36 538.05c-2.2 0-4.16-.05-5.64-.19-5.56-.51-10.87-4.62-13.54-7.02a3.791 3.791 0 01-.96-4.28 3.761 3.761 0 012.45-2.17l14.7-4.2 23.8-16.06.27.48c.1.18 2.44 4.39 3.22 7.23.3 1.08.22 1.98-.23 2.68-.31.48-.75.76-1.1.92.43.45 1.78 1.37 5.94 2.03 6.07.96 7.35-5.33 7.4-5.59l.04-.21.18-.12c2.89-1.86 4.67-2.71 5.28-2.53.38.11 1.02.31 2.75 17.44.17.54 1.38 4.48.56 8.25-.89 4.1-18.81 2.69-22.4 2.37-.1.01-13.52.97-22.71.97z"
        ></path>
        <path
          fill="#9f616a"
          d="M487.82 470.31H508.76V500.02H487.82z"
          transform="rotate(-31.95 498.288 485.158)"
        ></path>
        <path
          fill="#2f2e43"
          d="M475.72 533.98c-2.46 0-4.72-.3-6.33-.58a3.806 3.806 0 01-3.08-3.12c-.18-1.14.15-2.29.93-3.14l10.25-11.34 11.7-26.22.48.26c.18.1 4.39 2.43 6.56 4.43.83.76 1.24 1.57 1.22 2.4a2.53 2.53 0 01-.45 1.37c.6.16 2.23.22 6.11-1.42 5.66-2.39 3.42-8.41 3.32-8.66l-.08-.2.09-.19c1.47-3.11 2.52-4.77 3.14-4.94.39-.11 1.03-.28 11.56 13.35.43.36 3.54 3.07 4.84 6.7 1.41 3.95-14.54 12.24-17.75 13.86-.1.08-16.79 12.21-23.65 15.66-2.72 1.37-5.94 1.79-8.87 1.79zM455.11 241.91h-58.63l-5.32 54.54 23.28 201.52h29.93L432.4 381.58l48.55 105.08 26.6-18.62-37.91-98.1s13.54-85.46 2.9-106.75c-10.64-21.28-17.43-21.28-17.43-21.28z"
        ></path>
        <path
          fill="#e2e3e4"
          d="M484.28 245.23L391.16 245.23 419.1 124.85 459.67 124.85 484.28 245.23z"
        ></path>
        <path
          fill="#9f616a"
          d="M492.66 309.2c1.49 7.32-1.24 14.01-6.08 14.94s-9.97-4.26-11.45-11.58c-.63-2.92-.53-5.94.29-8.82l-18.43-114.75 23.05-4.34 8.9 116.5a18.38 18.38 0 013.72 8.06z"
        ></path>
        <path
          fill="#e2e3e4"
          d="M443.94 124.85h15.73c11.12 1.69 14.14 7.62 16.67 18.58 3.86 16.72 8.79 38.98 7.81 39.31-1.57.52-28.35 13.12-42 10.24l1.79-68.13z"
        ></path>
      </svg>
    </div>
    <div class="flex items-center justify-center">
      <form
        action=""
        class="w-full xl:w-1/2 border rounded-md m-10 p-10 xl:p-24 shadow-md"
        @submit.stop.prevent="login"
      >
        <div class="mb-6">
          <h4 class="text-3xl font-bold text-center">Login</h4>
        </div>
        <div class="mb-4">
          <label class="label">
            <span class="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Text your username ..."
            class="input input-bordered w-full focus:outline-none"
            autocomplete="username"
            v-model="username"
          />
        </div>
        <div class="mb-4">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Text your password ..."
            class="input input-bordered w-full focus:outline-none"
            autocomplete="current-password"
            v-model="password"
          />
        </div>
        <div class="mb-4 text-right">
          <button type="submit" class="btn btn-primary btn-outline">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
