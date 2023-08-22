<script setup lang="ts">
import type { IPagination } from 'composables/useCustomFetch';
import { renderSVG } from 'uqr';
interface IOwner {
  id: string;
  jid: string;
  deviceId: string;
  name: string;
  notify: string;
  status: string;
  verifiedName: string | null;
  avatar: string;
  updatedAt: string;
  createdAt: string;
}

interface IDevice {
  id: string;
  contactId: string;
  name: string;
  qr: null | string;
  status: string;
  startedAt: string;
  stoppedAt: null;
  updatedAt: string;
  createdAt: string;
  owner?: IOwner;
}

interface IEvent {
  deviceId: string;
  data: string;
}

useHead({
  title: 'Devices',
});

const notifyStore = useNotifyStore();
const socketStore = useSocketStore();

const loading = ref(true);
const devices = ref<IDevice[]>([]);
const pagination = ref<IPagination>();
const needRefresh = ref<boolean>(false);
const modal = ref<{
  show: boolean;
  data: string;
  title: string;
}>({
  show: false,
  data: '',
  title: '',
});

/**
 * Finds a device with the specified ID.
 *
 * @param {string} id - The ID of the device to find.
 * @return {IDevice | null} - The found device or null if not found.
 */
const findDevice = (id: string): IDevice | null => {
  return devices.value.find((device) => device.id === id) ?? null;
};

onMounted(async () => {
  const { data, refresh } = await useCustomFetch<IDevice[]>('/devices');
  const refreshData = async () => {
    loading.value = true;
    await refresh();
    loading.value = false;
  };

  socketStore.$subscribe(async (_, state) => {
    if (!state.needRefresh) {
      return;
    }
    refreshData();
  });

  if (needRefresh.value) {
    refreshData();
  }

  if (!data.value?.data) {
    return;
  }

  devices.value = data.value.data;
  pagination.value = data.value.pagination;
  loading.value = false;
});

onMounted(() => {
  socketStore.listen('QR_RECEIVED', (data: IEvent) => {
    const device = findDevice(data.deviceId);
    if (device) {
      device.qr = data.data;
      modal.value.data = renderSVG(device.qr ?? '', {});
    }
  });

  socketStore.listen('CONNECTION_UPDATE', (data: IEvent) => {
    const device = findDevice(data.deviceId);
    if (device) device.status = data.data;

    if (data.data === 'open') {
      modal.value.show = false;
      needRefresh.value = true;
    }
  });
});

/**
 * Starts a device with the given UUID.
 *
 * @param {string} uuid - The UUID of the device to start.
 * @return {Promise<void>} - A promise that resolves when the device is started.
 */
async function startDevice(uuid: string): Promise<void> {
  const { data, error } = await useCustomFetch(`/whatsapp/start/${uuid}`, {
    method: 'GET',
  });

  if (data.value) {
    notifyStore.notify('Device started', NotificationType.Success);
  }

  if (error.value) {
    notifyStore.notify(error, NotificationType.Error);
  }
}

/**
 * Restarts the device identified by the given UUID.
 *
 * @param {string} uuid - The UUID of the device to restart.
 * @return {Promise<void>} - A promise that resolves when the device is successfully restarted.
 */
async function restartDevice(uuid: string): Promise<void> {
  const { data, error } = await useCustomFetch(`/whatsapp/restart/${uuid}`, {
    method: 'GET',
  });

  if (data.value) {
    notifyStore.notify('Device restarted', NotificationType.Success);
  }

  if (error.value) {
    notifyStore.notify(error, NotificationType.Error);
  }
}

/**
 * Stops a device.
 *
 * @param {string} uuid - The UUID of the device to stop.
 * @return {Promise<void>} A promise that resolves when the device is stopped.
 */
async function stopDevice(uuid: string): Promise<void> {
  const { data, error } = await useCustomFetch(`/whatsapp/stop/${uuid}`, {
    method: 'GET',
  });

  if (data.value) {
    const device = findDevice(uuid);
    if (device) device.status = 'close';
    notifyStore.notify('Device stopped', NotificationType.Success);
  }

  if (error.value) {
    notifyStore.notify(error, NotificationType.Error);
  }
}

/**
 * Scans a QR code for a given UUID.
 *
 * @param {string} uuid - The UUID to scan the QR code for.
 * @return {void} This function does not return a value.
 */
function scanQr(uuid: string): void {
  const device = findDevice(uuid);
  modal.value.data = renderSVG(device?.qr ?? '');
  modal.value.show = true;
  modal.value.title = `Scan QR Code: ${device?.name}`;
}

/**
 * Closes the modal.
 *
 * @param {void} - This function does not take any parameters.
 * @return {void} - This function does not return any value.
 */
function closeModal(): void {
  modal.value.title = '';
  modal.value.data = '';
  modal.value.show = !modal.value.show;
}
</script>

<template>
  <div>
    <div
      class="flex justify-between items-center border-b p-4 bg-base-100 rounded"
    >
      <div class="mb-4 flex items-center">
        <ion-icon name="desktop-outline" class="text-2xl mr-2"></ion-icon>
        <h1 class="text-xl font-bold">Device</h1>
      </div>
      <div class="text-sm breadcrumbs">
        <ul>
          <li>
            <NuxtLink href="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/devices">Device</NuxtLink>
          </li>
          <li>System</li>
        </ul>
      </div>
    </div>
    <div class="mt-5 bg-base-100 p-4 rounded min-h-screen">
      <div class="p-4 border rounded mb-5">
        <div class="flex justify-between my-4">
          <div class="join">
            <div
              class="join-item items-center flex input-sm place-content-center border"
            >
              <ion-icon name="search-outline" class="text-base"></ion-icon>
            </div>

            <input
              type="text"
              placeholder="Seach here"
              class="input input-sm w-full max-w-xs join-item input-bordered focus:outline-none"
            />
          </div>
          <NuxtLink href="/devices/add" class="btn btn-sm btn-info btn-outline">
            Add
            <ion-icon name="add-outline" class="text-xl"></ion-icon>
          </NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr class="hover">
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Type</th>
                <th>Status</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="7" class="text-center p-10" v-if="loading">
                  <span class="sr-only">Loading</span>
                  <div class="flex items-center justify-center gap-4">
                    <span
                      className="loading loading-bars loading-xs text-info"
                    ></span>
                    <span
                      className="loading loading-bars loading-sm text-warning"
                    ></span>
                    <span
                      className="loading loading-bars loading-md text-success"
                    ></span>
                    <span
                      className="loading loading-bars loading-lg text-error"
                    ></span>
                  </div>
                </td>
              </tr>
              <tr
                class="hover rounded"
                v-for="device in devices"
                :key="device.id"
              >
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <td>
                  <div class="flex items-center space-x-3">
                    <div class="avatar online">
                      <div class="mask mask-squircle w-10 h-10">
                        <img
                          v-if="device.owner?.avatar"
                          :src="
                            serverAsset(`contacts/avatar/${device.owner.id}`)
                          "
                          :alt="device.owner.name"
                          width="40"
                          height="40"
                        />

                        <svg
                          v-else
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-10 h-10"
                          viewBox="0 0 512 512"
                        >
                          <rect
                            x="32"
                            y="64"
                            width="448"
                            height="320"
                            rx="32"
                            ry="32"
                            fill="none"
                            stroke="currentColor"
                            stroke-linejoin="round"
                            stroke-width="32"
                          />
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="32"
                            d="M304 448l-8-64h-80l-8 64h96z"
                          />
                          <path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="32"
                            d="M368 448H144"
                          />
                          <path
                            d="M32 304v48a32.09 32.09 0 0032 32h384a32.09 32.09 0 0032-32v-48zm224 64a16 16 0 1116-16 16 16 0 01-16 16z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">{{ device.name }}</div>
                      <div class="text-sm opacity-50">
                        {{
                          device.owner?.name ||
                          device.owner?.notify ||
                          device.owner?.verifiedName ||
                          '-'
                        }}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {{
                    device.owner?.jid
                      ? formatPhoneNumber(device.owner?.jid)
                      : '-'
                  }}
                </td>
                <td>
                  <span class="badge badge-ghost badge-md"> Desktop </span>
                </td>
                <td>
                  <span
                    class="badge badge-primary badge-md"
                    v-if="device.status === 'open'"
                    >Open</span
                  >
                  <span
                    class="badge badge-info badge-md"
                    v-else-if="device.status === 'connecting'"
                    >Connecting</span
                  >
                  <span
                    class="badge badge-info badge-md"
                    v-else-if="device.status === 'receivingQr'"
                    >Receiving QR</span
                  >
                  <span
                    class="badge badge-error badge-md"
                    v-else-if="device.status === 'close'"
                    >Close</span
                  >
                  <span class="badge badge-error badge-md" v-else>Close</span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <NuxtLink
                      :href="`/devices/info?uuid=${device.id}`"
                      class="btn btn-ghost btn-xs"
                    >
                      <ion-icon
                        name="information-circle-outline"
                        class="text-xl"
                      ></ion-icon>
                      Info
                    </NuxtLink>
                    <!-- <NuxtLink
                      :href="`/devices/system?uuid=${device.id}`"
                      class="btn btn-ghost btn-xs"
                    >
                      <ion-icon
                        name="construct-outline"
                        class="text-xl"
                      ></ion-icon>
                      System
                    </NuxtLink> -->
                    <button
                      class="btn btn-ghost btn-xs"
                      v-if="device.status === 'receivingQr'"
                      @click="scanQr(device.id)"
                    >
                      <ion-icon
                        name="qr-code-outline"
                        class="text-xl"
                      ></ion-icon>
                      Scan QR
                    </button>
                  </div>
                </td>
                <td>
                  <div class="join">
                    <div
                      class="tooltip tooltip-success"
                      data-tip="Start device"
                    >
                      <button
                        class="btn btn-outline btn-sm btn-success join-item"
                        @click="startDevice(device.id)"
                        :disabled="device.status !== 'close'"
                      >
                        <ion-icon
                          name="play-outline"
                          class="text-xl"
                        ></ion-icon>
                      </button>
                    </div>
                    <div
                      class="tooltip tooltip-warning"
                      data-tip="Restart device"
                    >
                      <button
                        class="btn btn-outline btn-sm btn-warning join-item"
                        @click="restartDevice(device.id)"
                        :disabled="device.status === 'close'"
                      >
                        <ion-icon
                          name="reload-outline"
                          class="text-xl"
                        ></ion-icon>
                      </button>
                    </div>
                    <div class="tooltip tooltip-error" data-tip="Stop device">
                      <button
                        class="btn btn-outline btn-sm btn-error join-item"
                        @click="stopDevice(device.id)"
                        :disabled="device.status === 'close'"
                      >
                        <ion-icon
                          name="stop-outline"
                          class="text-xl"
                        ></ion-icon>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex justify-between">
          <div></div>
          <Pagination v-if="pagination" :data="pagination" />
        </div>
      </div>
    </div>
    <div
      :class="{
        modal: true,
        'modal-open': modal.show,
      }"
    >
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ modal.title }}</h3>
        <div v-html="modal.data"></div>
        <div class="modal-action">
          <button @click="closeModal" class="btn btn-error text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
