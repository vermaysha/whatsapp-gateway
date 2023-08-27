<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
import type { IPagination } from 'composables/useCustomFetch';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

interface IAPIHistory {
  id: string;
  ip: string | null;
  fullpath: string | null;
  userAgent: string | null;
  updatedAt: string | null;
  createdAt: string | null;
}
interface IAPIToken {
  id: string;
  name: string;
  description: string | null;
  expiredAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  totalUsage: number;
  todayUsage: number;
}

useHead({
  title: 'Detail API Token',
});

const route = useRoute();
const notifyStore = useNotifyStore();
const socketStore = useSocketStore();
const uuid = route.query?.uuid;
const historyLoading = ref<boolean>(false);
const history = ref<IAPIHistory[]>([]);
const apiToken = ref<IAPIToken | null>(null);
const apiTokenLoading = ref<boolean>(false);
const pagination = ref<IPagination>();
const chartData = ref({
  labels: ['January', 'February', 'March'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [],
    },
  ],
});

if (!uuid) {
  navigateTo('/api-token');
}

const fetchData = async () => {
  historyLoading.value = true;
  const { data, error } = await useCustomFetch<IAPIHistory[]>(
    `/api-token/history/${uuid}`,
  );

  if (data.value) {
    history.value = data.value.data;
    pagination.value = data.value.pagination;
  }

  if (error.value) {
    notifyStore.notify(error.value.data.reason, NotificationType.Error);
  }

  historyLoading.value = false;
};

const fetchDetailData = async () => {
  apiTokenLoading.value = true;
  const { data, error } = await useCustomFetch<IAPIToken>(`/api-token/${uuid}`);

  if (data.value) {
    apiToken.value = data.value.data;
  }

  if (error.value) {
    notifyStore.notify(error.value.data.reason, NotificationType.Error);
  }

  apiTokenLoading.value = false;
};

onMounted(() => {
  fetchData();

  fetchDetailData();
});
</script>
<template>
  <div>
    <div
      class="flex justify-between items-center border-b p-4 bg-base-100 rounded"
    >
      <div class="mb-4 flex items-center">
        <ion-icon name="key-outline" class="text-2xl mr-2"></ion-icon>
        <h1 class="text-xl font-bold">Detail API Token</h1>
      </div>
      <div class="text-sm breadcrumbs">
        <ul>
          <li>
            <NuxtLink href="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/api-token">API Token</NuxtLink>
          </li>
          <li>Detail API Token</li>
        </ul>
      </div>
    </div>
    <div class="mt-5 bg-base-100 p-4 rounded min-h-screen">
      <div class="block lg:flex lg:gap-8">
        <div class="w-full lg:w-1/2 overflow-x-auto">
          <Bar
            :data="chartData"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
            }"
            class="h-96"
          />
        </div>
        <div class="w-full lg:w-1/2">
          <Loading v-if="apiTokenLoading || apiToken === null" />
          <div v-else>
            <table class="table mb-5">
              <tbody>
                <tr class="hover">
                  <th class="w-24 text-left">Name</th>
                  <td class="w-2 text-center">:</td>
                  <td class="text-left">{{ apiToken?.name }}</td>
                </tr>
                <tr class="hover">
                  <th class="w-24 text-left">Expire</th>
                  <td class="w-2 text-center">:</td>
                  <td class="text-left">
                    <span
                      :class="{
                        badge: true,
                        'badge-error':
                          new Date() > new Date(apiToken?.expiredAt),
                        'badge-success':
                          new Date() <= new Date(apiToken?.expiredAt),
                      }"
                      v-if="apiToken?.expiredAt"
                      >{{ formatDate(apiToken.expiredAt) }}</span
                    >
                    <span v-else class="badge badge-warning">Forever</span>
                  </td>
                </tr>
                <tr class="hover">
                  <th class="w-24 text-left">Description</th>
                  <td class="w-2 text-center">:</td>
                  <td class="text-left">
                    {{ apiToken?.description }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="stats stats-vertical md:stats-horizontal shadow">
              <div class="stat">
                <div class="stat-title">Today Usage</div>
                <div class="stat-value">{{ apiToken?.todayUsage || 0 }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">Total Usage</div>
                <div class="stat-value">{{ apiToken.totalUsage || 0 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 border rounded mb-5 mt-10">
        <div class="overflow-x-auto">
          <Loading v-if="historyLoading" />
          <table class="table" v-else>
            <thead>
              <tr class="hover">
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <th>Path</th>
                <th>User Agent</th>
                <th>IP</th>
                <th>Access time</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover" v-for="item in history" :key="item.id">
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <td>{{ item.fullpath }}</td>
                <td>{{ item.userAgent }}</td>
                <td>{{ item.ip }}</td>
                <td>{{ item.createdAt }}</td>
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
  </div>
</template>
