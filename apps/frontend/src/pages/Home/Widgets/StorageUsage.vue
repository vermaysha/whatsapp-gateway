<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Storage</h3>
      <div class="card-actions btn-actions">
        <button type="button" @click="getData" class="btn-action">
          <IconRefresh />
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="progress progress-separated mb-3">
        <div
          class="progress-bar bg-primary"
          role="progressbar"
          :style="{width: availablePercentage + '%'}"
          aria-label="Regular"
        ></div>
      </div>
      <div class="row">
        <div class="col-auto d-flex align-items-center pe-2">
          <span class="legend me-2 bg-primary"></span>
          <span>Available</span>
          <span
            class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary"
            >{{ formatBytes(available) }}</span
          >
        </div>
        <div class="col-auto d-flex align-items-center ps-2">
          <span class="legend me-2"></span>
          <span>Free</span>
          <span
            class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary"
            >{{ formatBytes(free) }}</span
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

const isLoading = ref<boolean>(true);
const total = ref<number>(0);
const available = ref<number>(0);
const free = ref<number>(0);
const availablePercentage = computed(() => {
  return (available.value / total.value) * 100
})

onMounted(() => {
  getData();
})

function getData() {
  isLoading.value = true;

  const res = ofetch('/system/disk', {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: 'include'
  })

  res.then((data) => {
    total.value = data.total
    available.value = data.available
    free.value = data.free
    isLoading.value = false;
  })
}
</script>
