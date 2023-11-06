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
            <WAProcess :is-connected="whatsapp?.workerState === 'connected'" />
          </div>
          <div class="col-12 col-md-3">
            <WAConnection
              :is-connected="whatsapp?.connectionState !== 'close'"
            />
          </div>
          <div class="col-12 col-md-3">
            <UptimeConnection :started-at="whatsapp?.workerStartedAt ?? null" />
          </div>
          <div class="col-12 col-md-3">
            <UptimeProcess />
          </div>
          <div class="col-12 col-md-6">
            <MemoryUsage />
          </div>
          <div class="col-12 col-md-6">
            <StorageUsage />
          </div>
          <div class="col-12">
            <RecentMessage />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IResponse {
  connectionState: "close" | "open" | "connecting";
  connectedAt: null | string;
  workerState: "connected" | "disconnected";
  workerStartedAt: null | string;
}
import WAProcess from "./Widgets/WAProcess.vue";
import WAConnection from "./Widgets/WAConnection.vue";
import UptimeConnection from "./Widgets/UptimeConnection.vue";
import UptimeProcess from "./Widgets/UptimeProcess.vue";
import RecentMessage from "./Widgets/RecentMessage.vue";
import MemoryUsage from "./Widgets/MemoryUsage.vue";
import StorageUsage from "./Widgets/StorageUsage.vue";
import { ref } from "vue";
import { useProcess } from '../../stores/useProcess'

const whatsapp = ref<IResponse | null>(null);

const process = useProcess();
process.getData();
process.listen();
</script>
