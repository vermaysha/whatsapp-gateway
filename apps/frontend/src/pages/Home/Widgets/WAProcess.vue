<template>
  <div class="card card-sm placeholder-glow">
    <div
      :class="{
        'card-body': true,
        'border-bottom': true,
        'border-success': !process.isLoading && process.isProcessConnected,
        'border-danger': !process.isLoading && !process.isProcessConnected,
      }"
    >
      <div class="row align-items-center">
        <div class="col-auto">
          <span
            :class="{
              'bg-green': !process.isLoading && process.isProcessConnected,
              'bg-danger': !process.isLoading && !process.isProcessConnected,
              'text-white': !process.isLoading,
              avatar: true,
              placeholder: process.isLoading,
            }"
          >
            <IconPlugConnected
              v-if="!process.isLoading && process.isProcessConnected"
            />
            <IconPlugConnectedX
              v-else-if="!process.isLoading && !process.isProcessConnected"
            />
          </span>
        </div>
        <div class="col">
            <strong>WA Process</strong>
            <div class="text-secondary" v-if="!process.isLoading">
              <span v-if="process.isProcessConnected">Running</span>
              <span v-else>Stopped</span>
            </div>
            <span class="placeholder placeholder-xs col-9" v-else></span>
        </div>
        <div class="col-auto">
          <div class="dropend">
            <a
              href="#"
              :class="{'btn-action': true, 'pe-none': process.isLoading}"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <IconDotsVertical />
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <h6 class="dropdown-header">Services Actions</h6>
              </li>
              <li v-if="!process.isProcessConnected">
                <a href="#" class="dropdown-item text-success">
                  <IconPlayerPlay />
                  <span class="px-2">Start</span>
                </a>
              </li>
              <li v-if="process.isProcessConnected">
                <a
                  href="#"
                  :class="{
                    'dropdown-item': true,
                    'text-danger': process.isProcessConnected,
                    'text-secondary': !process.isProcessConnected,
                    disabled: !process.isProcessConnected,
                  }"
                >
                  <IconPlayerStop />
                  <span class="px-2">Stop</span>
                </a>
              </li>
              <li v-if="process.isProcessConnected">
                <a href="#" class="dropdown-item text-warning">
                  <IconRefresh />
                  <span class="px-2">Restart</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  IconPlugConnected,
  IconDotsVertical,
  IconPlayerStop,
  IconPlayerPlay,
  IconRefresh,
  IconPlugConnectedX,
} from "@tabler/icons-vue";
// import { ref } from "vue";
import { useProcess } from "../../../stores/useProcess";

const process = useProcess();

// const isConnected = ref(process.isProcessConnected);
</script>
