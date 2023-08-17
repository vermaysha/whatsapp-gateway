<script setup lang="ts">
const socket = useSocketStore();

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
