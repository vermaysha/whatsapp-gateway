<template>
  <div>
    <div class="page-header d-print-none">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">Whatsapp Gateway</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="page-body">
      <div class="container-xl">
        <div class="row row-deck row-cards">
          <div class="col-12 col-md-3">
            <WAProcess />
          </div>
          <div class="col-12 col-md-3">
            <WAConnection />
          </div>
          <div class="col-12 col-md-3">
            <UptimeServer />
          </div>
          <div class="col-12 col-md-3">
            <UptimeProcess />
          </div>
          <div class="col-12 col-md-6">
            <MemoryUsage/>
          </div>
          <div class="col-12 col-md-6">
            <StorageUsage/>
          </div>
          <div class="col-12">
            <RecentMessage/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WAProcess from "./Widgets/WAProcess.vue";
import WAConnection from "./Widgets/WAConnection.vue";
import UptimeServer from "./Widgets/UptimeServer.vue";
import UptimeProcess from "./Widgets/UptimeProcess.vue";
import RecentMessage from "./Widgets/RecentMessage.vue";
import MemoryUsage from "./Widgets/MemoryUsage.vue";
import StorageUsage from "./Widgets/StorageUsage.vue";
</script>
