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
            <IconWifi v-if="!process.isLoading && process.isConnected" />
            <IconWifiOff
              v-else-if="!process.isLoading && !process.isConnected"
            />
          </span>
        </div>
        <div class="col">
          <strong>WA Connection</strong>
          <div class="text-secondary" v-if="!process.isLoading">
            <span v-if="process.isConnected"
              >Connected</span
            >
            <span v-else-if="!process.isConnected"
              >Disconnected</span
            >
          </div>
          <span class="placeholder placeholder-xs col-9" v-else></span>
        </div>
        <div class="col-auto" v-if="!process.isLoading && value">
          <a
            href="javascript:void(0);"
            class="btn-action"
            @click="qrModal?.show()"
          >
            <IconQrcode />
          </a>
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
              <li v-if="!process.isLoading && !process.isConnected">
                <button type="button" @click="start" class="dropdown-item text-success">
                  <IconPlayerPlay />
                  <span class="px-2">Connect</span>
                </button>
              </li>
              <li v-if="!process.isLoading && process.isConnected">
                <button type="button" @click="stop" class="dropdown-item text-danger">
                  <IconPlayerStop />
                  <span class="px-2">Disconnect</span>
                </button>
              </li>
              <li v-if="!process.isLoading && process.isConnected">
                <button type="button" @click="restart" class="dropdown-item text-warning">
                  <IconRefresh />
                  <span class="px-2">Reconnect</span>
                </button>
              </li>
              <!--  <li v-if="!process.isLoading && process.isConnected">
                <hr class="dropdown-divider" />
              </li>
              <li v-if="!process.isLoading && process.isConnected">
                <h6 class="dropdown-header">Whatsapp Actions</h6>
              </li>
              <li v-if="!process.isLoading && process.isConnected">
                <a href="#" class="dropdown-item text-success">
                  <IconLinkPlus />
                  <span class="px-2">Link Devices</span>
                </a>
              </li>
              <li v-if="!process.isLoading && process.isConnected">
                <a href="#" class="dropdown-item text-danger">
                  <IconLinkOff />
                  <span class="px-2">Un-Link Devices</span>
                </a>
              </li> -->
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal"
      ref="qrModalTags"
      id="scanQRModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Scan Whatsapp QR Code</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <QRCode
              v-if="value"
              :size="1000"
              :value="value"
              :level="level"
              :render-as="renderAs"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  IconWifi,
  IconDotsVertical,
  IconPlayerStop,
  IconPlayerPlay,
  IconRefresh,
  IconQrcode,
  // IconLinkPlus,
  // IconLinkOff,
  IconWifiOff,
} from "@tabler/icons-vue";
import { Modal } from "bootstrap";
import { ref, onMounted } from "vue";
import QRCode, { Level, RenderAs } from "qrcode.vue";
import { useProcess } from "../../../stores/useProcess";

import { ofetch } from "ofetch";
import { useToasts } from '../../../stores/useToasts';

const process = useProcess();
const toast = useToasts();

const qrModalTags = ref<Element | null>(null);
const qrModal = ref<Modal | null>(null);

const value = ref<string | null>(process.qr);
const level = ref<Level>("L");
const renderAs = ref<RenderAs>("svg");

onMounted(() => {
  if (qrModalTags.value) {
    qrModal.value = new Modal(qrModalTags.value, {
      backdrop: "static",
      focus: true,
      keyboard: false,
    });
  }
  listenQR();
});

function listenQR() {
  const event = new EventSource(new URL('event/qr', import.meta.env.VITE_API_URL), {
    withCredentials: true,
  });
  event.addEventListener('error', (e) => {
    toast.dispatch({
      title: "Event Listener Error",
      message: "Connection error to State Event Listener",
      type: "danger",
    })
    console.error(e)
  })
  event.addEventListener('message', (ev) => {
    value.value = ev.data
    qrModal.value?.show();
  })

  process.$subscribe((_, data) => {
    if (data.connectionState === 'open') {
      qrModal.value?.hide();
      value.value = null;
    }

    if (data.qr) {
      value.value = data.qr
      qrModal.value?.show();
    }
  })
}

function start() {
  const res = ofetch('/whatsapp/start', {
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
      title: "Connection Established",
      message: 'Connection to the WhatsApp server has been established.'
    })
  })
}

function stop() {
  const res = ofetch('/whatsapp/stop', {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: 'include',
  })

  res.catch((err) => {
    toast.dispatch({
      type: 'danger',
      title: 'Error',
      message: err.data ?? err.message ?? 'Failed to stop process',
    })
  })

  res.then(() => {
    toast.dispatch({
      type: 'danger',
      title: "Connection Closed",
      message: 'Connection to the WhatsApp server has been closed.'
    })
  })
}

function restart() {
  const res = ofetch('/whatsapp/restart', {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: 'include',
  })

  res.catch((err) => {
    toast.dispatch({
      type: 'danger',
      title: 'Error',
      message: err.data ?? err.message ?? 'Failed to restart connection',
    })
  })

  res.then(() => {
    toast.dispatch({
      type: 'success',
      title: "Connection Restarted",
      message: 'Connection to the WhatsApp server has been restarted.'
    })
  })
}
</script>
