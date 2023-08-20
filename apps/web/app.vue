<script setup lang="ts">
const socket = useSocketStore();

useHead({
  script: [
    {
      nomodule: true,
      src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js',
    },
    {
      type: 'module',
      src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
    },
  ],
});

onMounted(() => {
  socket.connect();
  socket.listenDefaultEvent();
});
</script>

<template>
  <div data-theme="light">
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
      <ToastNotification />
    </NuxtLayout>
  </div>
</template>
