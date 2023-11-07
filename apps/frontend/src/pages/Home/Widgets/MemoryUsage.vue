<template>
  <div class="card placeholder-glow">
    <div class="card-header">
      <h3 class="card-title">Memory Usage</h3>
      <div class="card-actions btn-actions">
        <button type="button" @click="getData" class="btn-action">
          <IconRefresh />
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="progress progress-separated mb-3" v-if="!isLoading">
        <div
          class="progress-bar bg-primary"
          role="progressbar"
          :style="{width: serverPercentage + '%'}"
          aria-label="Server Usage"
        ></div>
        <div
          class="progress-bar bg-info"
          role="progressbar"
          :style="{width: processPercentage + '%'}"
          aria-label="Process Usage"
        ></div>
        <div
          class="progress-bar bg-secondary"
          role="progressbar"
          :style="{width: otherPercentage + '%'}"
          aria-label="Other Usage"
        ></div>
      </div>
      <div v-else>
        <span class="placeholder placeholder-xs col-12"></span>
      </div>
      <div v-if="isLoading" class="d-flex gap-2">
        <span class="placeholder placeholder-xs col-2"></span>
        <span class="placeholder placeholder-xs col-2"></span>
        <span class="placeholder placeholder-xs col-2"></span>
        <span class="placeholder placeholder-xs col-2"></span>
      </div>
      <div class="row" v-else>
        <div class="col-auto d-flex align-items-center pe-2">
          <span class="legend me-2 bg-primary"></span>
          <span>Server</span>
          <span
            class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary"
            >{{ formatBytes(serverUsage) }}</span
          >
        </div>
        <div class="col-auto d-flex align-items-center px-2">
          <span class="legend me-2 bg-info"></span>
          <span>Whatsapp</span>
          <span
            class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary"
            >{{ formatBytes(processUsage) }}</span
          >
        </div>
        <div class="col-auto d-flex align-items-center px-2">
          <span class="legend me-2 bg-secondary"></span>
          <span>Other</span>
          <span
            class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary"
            >{{ formatBytes(otherUsage) }}</span
          >
        </div>
        <div class="col-auto d-flex align-items-center ps-2">
          <span class="legend me-2"></span>
          <span>Free</span>
          <span
            class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary"
            >{{ formatBytes(freeMemory) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { IconRefresh } from "@tabler/icons-vue";
import { ref, onMounted, computed } from "vue";
import { ofetch } from "ofetch";
import formatBytes from 'pretty-bytes';

const processUsage = ref<number>(0);
const serverUsage = ref<number>(0);
const otherUsage = ref<number>(0);
const totalMemory = ref<number>(0);
const freeMemory = computed(() => {
  return totalMemory.value - processUsage.value - serverUsage.value - otherUsage.value;
})
const isLoading = ref<boolean>(true);

const serverPercentage = computed(() => {
  return (serverUsage.value / totalMemory.value) * 100
})
const processPercentage = computed(() => {
  return (processUsage.value / totalMemory.value) * 100
})
const otherPercentage = computed(() => {
  return (otherUsage.value / totalMemory.value) * 100
})

onMounted(() => {
  getData();
})

function getData() {
  isLoading.value = true;
  const res = ofetch('/system/memory', {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: 'include'
  })

  res.then((data) => {
    totalMemory.value = data.total
    processUsage.value = data.process
    serverUsage.value = data.server
    otherUsage.value = data.other
    isLoading.value = false;
  })
}
</script>
