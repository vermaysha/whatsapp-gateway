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
              :class="{ 'btn-action': true, 'pe-none': process.isLoading }"
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
                <button type="button" class="dropdown-item text-success" @click="start">
                  <IconPlayerPlay />
                  <span class="px-2">Start</span>
                </button>
              </li>
              <li v-if="process.isProcessConnected">
                <button
                  type="button"
                  :class="{
                    'dropdown-item': true,
                    'text-danger': process.isProcessConnected,
                    'text-secondary': !process.isProcessConnected,
                    disabled: !process.isProcessConnected,
                  }" @click="stop"
                >
                  <IconPlayerStop />
                  <span class="px-2">Stop</span>
                </button>
              </li>
              <li v-if="process.isProcessConnected" @click="restart">
                <button type="button" class="dropdown-item text-warning">
                  <IconRefresh />
                  <span class="px-2">Restart</span>
                </button>
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
import { ofetch } from "ofetch";
import { useToasts } from '../../../stores/useToasts';

const process = useProcess();
const toast = useToasts();

function start() {
  const res = ofetch('/whatsapp/connect', {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: 'include',
  });

  res.catch((err) => {
    toast.dispatch({
      type: 'danger',
      title: 'Error',
      message: err.data ?? err.message ?? 'Failed to start process',
    })
  })

  res.then(() => {
    toast.dispatch({
      type: 'success',
      title: "Process Started",
      message: 'WhatsApp server process has been spawned.'
    })
  })
}

function stop() {
  const res = ofetch("/whatsapp/disconnect", {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: 'include'
  })

  res.catch((err) => {
    toast.dispatch({
      type: 'danger',
      title: 'Error',
      message: err.data ?? err.message ?? 'Failed to start process',
    })
  })

  res.then(() => {
    toast.dispatch({
      type: 'danger',
      title: "Process Killed",
      message: 'WhatsApp server process has been killed.'
    })
  })
}

function restart() {
  const res = ofetch('/whatsapp/reconnect', {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: 'include',
  })

  res.catch((err) => {
    toast.dispatch({
      type: 'danger',
      title: 'Error',
      message: err.data ?? err.message ?? 'Failed to restart process',
    })
  })

  res.then(() => {
    toast.dispatch({
      type: 'success',
      title: "Process Restarted",
      message: 'WhatsApp server process has been restarted.'
    })
  })
}
</script>
