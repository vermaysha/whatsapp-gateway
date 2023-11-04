<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Memory Usage</h3>
      <div class="card-actions btn-actions">
        <a href="#" class="btn-action">
          <IconRefresh />
        </a>
      </div>
    </div>
    <div class="card-body">
      <div class="progress progress-separated mb-3">
        <div
          class="progress-bar bg-primary"
          role="progressbar"
          style="width: 44%"
          aria-label="Regular"
        ></div>
        <div
          class="progress-bar bg-info"
          role="progressbar"
          style="width: 19%"
          aria-label="System"
        ></div>
      </div>
      <div class="row">
        <div class="col-auto d-flex align-items-center pe-2">
          <span class="legend me-2 bg-primary"></span>
          <span>Server</span>
          <span
            class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary"
            >915MB</span
          >
        </div>
        <div class="col-auto d-flex align-items-center px-2">
          <span class="legend me-2 bg-info"></span>
          <span>Whatsapp</span>
          <span
            class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary"
            >415MB</span
          >
        </div>
        <div class="col-auto d-flex align-items-center ps-2">
          <span class="legend me-2"></span>
          <span>Free</span>
          <span
            class="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary"
            >612MB</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { IconRefresh } from "@tabler/icons-vue";
</script>
