<template>
  <div class="card card-sm placeholder-glow">
    <div
      :class="{
        'card-body': true,
        'border-bottom': true,
        'border-success': !process.isLoading && process.isConnected,
        'border-danger': !process.isLoading && !process.isConnected,
      }"
    >
      <div class="row align-items-center">
        <div class="col-auto">
          <span
            :class="{
              'bg-green': !process.isLoading && process.isConnected,
              'bg-danger': !process.isLoading && !process.isConnected,
              'text-white': !process.isLoading,
              avatar: true,
              placeholder: process.isLoading,
            }"
          >
            <IconAlarm v-if="!process.isLoading" />
          </span>
        </div>
        <div class="col">
          <strong>Connection Uptime</strong>
          <div class="text-secondary" v-if="!process.isLoading">{{ uptime }}</div>
          <div class="placeholder placeholder-xs col-9" v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IconAlarm } from "@tabler/icons-vue";
import { computed } from "vue";
import { formatDistanceToNow } from "date-fns";
import { useProcess } from "../../../stores/useProcess";

const process = useProcess();

const uptime = computed(() => {
  if (!process.connectedAt) {
    return "-";
  }

  return formatDistanceToNow(process.connectedAt, {
    addSuffix: true,
  });
});
</script>
