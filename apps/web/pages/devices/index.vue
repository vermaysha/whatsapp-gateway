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
    if (device) device.status = 'closed';
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokewidth="1.5"
          stroke="currentColor"
          class="w-6 h-6 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
          />
        </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokewidth="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Seach here"
              class="input input-sm w-full max-w-xs join-item input-bordered focus:outline-none"
            />
          </div>
          <NuxtLink href="/devices/add" class="btn btn-sm btn-info btn-outline">
            Add
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokewidth="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
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
                          :src="device.owner.avatar"
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
                    v-else-if="device.status === 'receiving_qr'"
                    >Receiving QR</span
                  >
                  <span
                    class="badge badge-error badge-md"
                    v-else-if="device.status === 'closed'"
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokewidth="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                      Info
                    </NuxtLink>
                    <NuxtLink
                      :href="`/devices/system?uuid=${device.id}`"
                      class="btn btn-ghost btn-xs"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokewidth="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                        />
                      </svg>
                      System
                    </NuxtLink>
                    <button
                      class="btn btn-ghost btn-xs"
                      v-if="device.status === 'receiving_qr'"
                      @click="scanQr(device.id)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        viewBox="0 0 512 512"
                      >
                        <rect
                          x="336"
                          y="336"
                          width="80"
                          height="80"
                          rx="8"
                          ry="8"
                        />
                        <rect
                          x="272"
                          y="272"
                          width="64"
                          height="64"
                          rx="8"
                          ry="8"
                        />
                        <rect
                          x="416"
                          y="416"
                          width="64"
                          height="64"
                          rx="8"
                          ry="8"
                        />
                        <rect
                          x="432"
                          y="272"
                          width="48"
                          height="48"
                          rx="8"
                          ry="8"
                        />
                        <rect
                          x="272"
                          y="432"
                          width="48"
                          height="48"
                          rx="8"
                          ry="8"
                        />
                        <rect
                          x="336"
                          y="96"
                          width="80"
                          height="80"
                          rx="8"
                          ry="8"
                        />
                        <rect
                          x="288"
                          y="48"
                          width="176"
                          height="176"
                          rx="16"
                          ry="16"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="32"
                        />
                        <rect
                          x="96"
                          y="96"
                          width="80"
                          height="80"
                          rx="8"
                          ry="8"
                        />
                        <rect
                          x="48"
                          y="48"
                          width="176"
                          height="176"
                          rx="16"
                          ry="16"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="32"
                        />
                        <rect
                          x="96"
                          y="336"
                          width="80"
                          height="80"
                          rx="8"
                          ry="8"
                        />
                        <rect
                          x="48"
                          y="288"
                          width="176"
                          height="176"
                          rx="16"
                          ry="16"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="32"
                        />
                      </svg>
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
                        :disabled="device.status !== 'closed'"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokewidth="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div
                      class="tooltip tooltip-warning"
                      data-tip="Restart device"
                    >
                      <button
                        class="btn btn-outline btn-sm btn-warning join-item"
                        @click="restartDevice(device.id)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokewidth="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                      </button>
                    </div>
                    <div class="tooltip tooltip-error" data-tip="Stop device">
                      <button
                        class="btn btn-outline btn-sm btn-error join-item"
                        @click="stopDevice(device.id)"
                        :disabled="device.status === 'closed'"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokewidth="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                          />
                        </svg>
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
