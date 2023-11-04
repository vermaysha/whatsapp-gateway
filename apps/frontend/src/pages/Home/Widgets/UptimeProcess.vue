<template>
  <div class="card card-sm">
    <div class="card-body border-bottom border-success">
      <div class="row align-items-center">
        <div class="col-auto">
          <span class="bg-green text-white avatar">
            <IconClock />
          </span>
        </div>
        <div class="col">
          <strong>Uptime Process</strong>
          <div class="text-secondary">20 hours</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IconClock } from "@tabler/icons-vue";
</script>
