<script lang="ts" setup>
import { formatDistanceToNow } from 'date-fns';
import { renderSVG } from 'uqr';

interface IContact {
  id: string;
  jid: string;
  deviceId: string | null;
  name: string | null;
  notify: string | null;
  status: string | null;
  verifiedName: string | null;
  avatar: string | null;
  updatedAt: string;
  createdAt: string;
}
interface IEvent {
  deviceId: string;
  data: string;
}
interface ILog {
  id: string;
  deviceId: string;
  level: number;
  time: string;
  pid: number;
  hostname: number;
  node: any;
  msg: string;
  trace: string | null;
  meta: any;
  updatedAt: string;
  createdAt: string;
}
interface IDevice {
  id: string;
  contactId: string | null;
  userId: string;
  name: string;
  qr: string | null;
  status: 'open' | 'close' | 'connecting' | 'loggedOut';
  startedAt: string | null;
  stoppedAt: string | null;
  updatedAt: string;
  createdAt: string;
  owner?: IContact;
  logs?: ILog[];
  _count: {
    messages: number;
    contacts: number;
  };
}
useHead({
  title: 'Device Info',
});

const route = useRoute();
const notifyStore = useNotifyStore();
const socketStore = useSocketStore();
const uuid = route.query?.uuid;
const loading = ref<boolean>(false);
const device = ref<IDevice | null>(null);

if (!uuid) {
  navigateTo('/devices');
}

const fetchData = async () => {
  loading.value = true;
  const { data, error } = await useCustomFetch<IDevice>(`/devices/${uuid}`);

  if (error.value) {
    notifyStore.notify(error, NotificationType.Error);
  }

  if (data.value) {
    device.value = data.value.data;
  }

  loading.value = false;
};

onMounted(() => {
  fetchData();
});

onMounted(() => {
  socketStore.listen('QR_RECEIVED', (data: IEvent) => {
    if (device.value?.id === data.deviceId) {
      device.value.qr = data.data;
    }
  });

  socketStore.listen('CONNECTION_UPDATE', (data: IEvent) => {
    if (device.value?.id === data.deviceId) {
      device.value.status = data.data as any;
      if (device.value.status === 'open') {
        device.value.startedAt = new Date().toISOString();
      }
      if (device.value.status === 'close') {
        device.value.stoppedAt = new Date().toISOString();
      }
    }
  });
});

/**
 * Starts a device with the given UUID.
 *
 * @return {Promise<void>} - A promise that resolves when the device is started.
 */
async function startDevice(): Promise<void> {
  if (!device.value?.id) {
    return;
  }

  const { data, error } = await useCustomFetch(
    `/whatsapp/start/${device.value?.id}`,
    {
      method: 'GET',
    },
  );

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
 * @return {Promise<void>} - A promise that resolves when the device is successfully restarted.
 */
async function restartDevice(): Promise<void> {
  if (!device.value?.id) {
    return;
  }

  const { data, error } = await useCustomFetch(
    `/whatsapp/restart/${device.value?.id}`,
    {
      method: 'GET',
    },
  );

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
 * @return {Promise<void>} A promise that resolves when the device is stopped.
 */
async function stopDevice(): Promise<void> {
  if (!device.value?.id) {
    return;
  }

  const { data, error } = await useCustomFetch(
    `/whatsapp/stop/${device.value?.id}`,
    {
      method: 'GET',
    },
  );

  if (data.value) {
    if (device.value?.status) device.value.status = 'close';
    notifyStore.notify('Device stopped', NotificationType.Success);
  }

  if (error.value) {
    notifyStore.notify(error, NotificationType.Error);
  }
}
</script>
<template>
  <div>
    <div
      class="mt-5 bg-base-100 p-4 rounded min-h-[calc(100vh-220px)] flex items-center justify-center"
      v-if="loading"
    >
      <Loading />
    </div>
    <div v-else>
      <div
        class="flex justify-between items-center border-b p-4 bg-base-100 rounded"
      >
        <div class="mb-4 flex items-center gap-2">
          <ion-icon name="desktop-outline" class="text-2xl"></ion-icon>
          <h1 class="text-xl font-bold">Device Info</h1>
        </div>
        <div class="text-sm breadcrumbs">
          <ul>
            <li>
              <NuxtLink href="/">Home</NuxtLink>
            </li>
            <li>
              <NuxtLink href="/devices">Device</NuxtLink>
            </li>
            <li>Info</li>
          </ul>
        </div>
      </div>
      <div class="mt-5 bg-base-100 p-4 rounded min-h-screen">
        <div class="card w-full p-0">
          <div class="card-body p-0">
            <div
              class="stats stats-vertical border rounded-md w-full md:stats-horizontal mb-8"
            >
              <div class="stat md:place-items-center">
                <div
                  :class="{
                    'stat-figure': true,
                    'text-success': device?.status === 'open',
                    'text-error': device?.status === 'close',
                    'text-warning': device?.status === 'loggedOut',
                    'text-info': device?.status === 'connecting',
                  }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    class="w-8 h-8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                    />
                  </svg>
                </div>
                <div class="stat-title">Status</div>
                <div class="stat-value">
                  <span class="text-success" v-if="device?.status === 'open'"
                    >Online</span
                  >
                  <span class="text-error" v-if="device?.status === 'close'"
                    >Offline</span
                  >
                  <span
                    class="text-warning"
                    v-if="device?.status === 'loggedOut'"
                    >Logged Out</span
                  >
                  <span class="text-info" v-if="device?.status === 'connecting'"
                    >Connecting</span
                  >
                </div>
                <!-- <div class="stat-desc">Total connected device</div> -->
              </div>
              <div class="stat md:place-items-center">
                <div class="stat-figure text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    class="w-8 h-8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="stat-title">Uptime</div>
                <div
                  class="stat-value"
                  v-if="device?.status === 'open' && device?.startedAt"
                >
                  {{ formatDistanceToNow(new Date(device.startedAt)) }}
                </div>
                <div class="stat-value" v-else>-</div>
                <!-- <div class="stat-desc">Total disconnected devices</div> -->
              </div>
              <div class="stat md:place-items-center">
                <div class="stat-figure text-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    class="w-8 h-8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                    />
                  </svg>
                </div>
                <div class="stat-title">Message Sended</div>
                <div class="stat-value">
                  {{ device?._count.messages || '0' }}
                </div>
              </div>
              <div class="stat md:place-items-center">
                <div class="stat-figure text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    class="w-8 h-8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </div>
                <div class="stat-title">Total Contacts</div>
                <div class="stat-value">
                  {{ device?._count.contacts || '0' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"
        >
          <div
            class="col-span-12 border rounded-md px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-6 p-4"
          >
            <div class="mb-4 flex items-center gap-2">
              <ion-icon
                name="information-circle-outline"
                class="text-2xl"
              ></ion-icon>

              <h4 class="text-xl font-semibold">General Information</h4>
            </div>
            <table class="table">
              <tbody>
                <tr class="hover">
                  <th class="w-25">UUID</th>
                  <td class="w-1">:</td>
                  <td>{{ device?.id }}</td>
                </tr>
                <tr class="hover">
                  <th class="w-25">Name</th>
                  <td class="w-1">:</td>
                  <td>{{ device?.name }}</td>
                </tr>
                <tr class="hover">
                  <th class="w-25">Owner</th>
                  <td class="w-1">:</td>
                  <td v-if="device?.owner">
                    <div class="flex items-center space-x-3">
                      <div class="avatar">
                        <div class="mask mask-squircle w-10 h-10">
                          <img
                            v-if="device.owner"
                            :src="
                              serverAsset(`contacts/avatar/${device.owner.id}`)
                            "
                            :alt="device.owner.name || '-'"
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
                        {{
                          device.owner?.name ||
                          device.owner?.notify ||
                          device.owner?.verifiedName ||
                          '-'
                        }}
                      </div>
                    </div>
                  </td>
                  <td v-else>-</td>
                </tr>
                <!-- <tr class="hover">
                  <th class="w-25">Description</th>
                  <td class="w-1">:</td>
                  <td>
                    Lorem, ipsum dolor sit amet consectetur adipisicing e-lit. Recusandae
                    adipisci corporis, nobis ipsa in natus at illo aliquid quia sapiente
                    repellendus libero, cum consequatur? Hic iure maxime suscipit et
                    distinctio.
                  </td>
                </tr>
                <tr class="hover">
                  <th class="w-25">Operation System</th>
                  <td class="w-1">:</td>
                  <td>
                    <span class="badge bg-[#E95420] text-white"> Ubuntu </span>
                  </td>
                </tr>
                <tr class="hover">
                  <th class="w-25">Browser</th>
                  <td class="w-1">:</td>
                  <td>
                    <span class="badge bg-[#3277BC] text-white"> Microsoft Edge </span>
                  </td>
                </tr> -->
                <tr class="hover">
                  <th class="w-25">Created At</th>
                  <td class="w-1">:</td>
                  <td v-if="device?.createdAt">
                    {{ formatDate(device.createdAt) }}
                  </td>
                  <td v-else>-</td>
                </tr>
              </tbody>
            </table>
            <!-- <div class="flex justify-between mt-4">
              <button type="button" class="btn btn-sm btn-outline btn-error">
                Delete
              </button>
              <NuxtLink
                href="/devices/edit?uuid=asjdhasjkdhasjkhdasjk"
                type="button"
                class="btn btn-sm btn-outline btn-primary"
              >
                Edit
              </NuxtLink>
            </div> -->
          </div>
          <div
            class="col-span-12 border rounded-md px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-6 p-4"
          >
            <div class="mb-4 flex items-center gap-2">
              <ion-icon name="globe-outline" class="text-2xl"></ion-icon>
              <h4 class="text-xl font-semibold">Connectivity Information</h4>
            </div>
            <table class="table">
              <tbody>
                <tr class="hover">
                  <th class="w-30">Last started at</th>
                  <td class="w-1">:</td>
                  <td v-if="device?.startedAt">
                    {{ formatDate(device.startedAt) }}
                  </td>
                  <td v-else>-</td>
                </tr>
                <tr class="hover">
                  <th class="w-30">Last disconnect at</th>
                  <td class="w-1">:</td>
                  <td v-if="device?.stoppedAt">
                    {{ formatDate(device.stoppedAt) }}
                  </td>
                  <td v-else>-</td>
                </tr>
                <tr class="hover">
                  <th class="w-30">Uptime</th>
                  <td class="w-1">:</td>
                  <td v-if="device?.status === 'open' && device.startedAt">
                    {{ formatDistanceToNow(new Date(device.startedAt)) }}
                  </td>
                  <td v-else>-</td>
                </tr>
                <!-- <tr class="hover">
                  <th class="w-30">Total reconnect</th>
                  <td class="w-1">:</td>
                  <td>
                    <span class="badge badge-warning">44</span>
                  </td>
                </tr> -->
                <tr class="hover">
                  <th class="w-30">Action</th>
                  <td class="w-1">:</td>
                  <td>
                    <div class="join">
                      <div
                        class="tooltip tooltip-success"
                        data-tip="Start device"
                      >
                        <button
                          class="btn btn-outline btn-sm btn-success join-item"
                          @click="startDevice"
                          :disabled="!device?.id || device?.status !== 'close'"
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
                          @click="restartDevice"
                          :disabled="!device?.id || device?.status === 'close'"
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
                          @click="stopDevice"
                          :disabled="!device?.id || device?.status === 'close'"
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
        </div>
      </div>
    </div>
  </div>
</template>
