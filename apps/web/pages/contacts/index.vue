<script setup lang="ts">
import type { IPagination } from 'composables/useCustomFetch';
interface IDeviceSummary {
  id: string;
  name: string;
}
interface IQuery {
  search: string | null;
  device: string | null;
  page: number;
}
interface IContact {
  id: string;
  jid: string;
  deviceId: string | null;
  name: string | null;
  notify: string | null;
  status: string | null;
  verifiedName: string | null;
  avatar: string;
  updatedAt: string;
  createdAt: string;
}

useHead({
  title: 'Contacts',
});
const notifyStore = useNotifyStore();

const options = ref<{ value: string; label: string }[]>([]);
const query = reactive<IQuery>({
  search: null,
  device: null,
  page: 1,
});
const loading = ref<boolean>(false);
const contacts = ref<IContact[]>([]);
const pagination = ref<IPagination>();

onMounted(async () => {
  const { data } = await useCustomFetch<IDeviceSummary[]>('/devices/summary');

  if (data.value) {
    options.value = data.value.data.map((device) => {
      return {
        value: device.id,
        label: device.name,
      };
    });
  }

  fetchData();
});

watch(query, () => {
  fetchData();
});

async function fetchData() {
  loading.value = true;
  const { data, error } = await useCustomFetch<IContact[]>('/contacts', {
    query,
  });

  if (data.value) {
    contacts.value = data.value.data;
    pagination.value = data.value.pagination;
  }

  if (error.value) {
    notifyStore.notify(error, NotificationType.Error);
  }

  loading.value = false;
}

function pageChanged(page: number) {
  query.page = page;
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
        <h1 class="text-xl font-bold">Contact</h1>
      </div>
      <div class="text-sm breadcrumbs">
        <ul>
          <li>
            <NuxtLink href="/">Home</NuxtLink>
          </li>
          <li>Contact</li>
        </ul>
      </div>
    </div>
    <div class="mt-5 bg-base-100 p-4 rounded min-h-screen">
      <div class="p-4 border rounded mb-5">
        <div class="flex justify-between items-center my-4">
          <div class="form-control w-full max-w-xs z-50">
            <select
              class="select select-bordered select-sm"
              v-model="query.device"
            >
              <option selected :value="null">All Devices</option>
              <option
                v-for="item in options"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
          </div>
          <div class="join">
            <input
              v-model="query.search"
              type="text"
              placeholder="Seach here"
              class="input input-sm w-full max-w-xs join-item input-bordered focus:outline-none"
            />
            <div
              class="join-item items-center flex input-sm place-content-center border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                viewBox="0 0 512 512"
              >
                <path
                  d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
                  fill="none"
                  stroke="currentColor"
                  stroke-miterlimit="10"
                  stroke-width="32"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="32"
                  d="M338.29 338.29L448 448"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <Loading v-if="loading" />
          <table class="table" v-else>
            <thead>
              <tr class="hover">
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Status</th>
                <th>Phone number</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="hover rounded"
                v-for="contact in contacts"
                :key="contact.id"
              >
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <td>
                  <div class="flex items-center space-x-3">
                    <div class="avatar">
                      <div class="mask mask-squircle w-10 h-10">
                        <img
                          v-if="contact.avatar"
                          :src="serverAsset(`contacts/avatar/${contact.id}`)"
                          :alt="
                            contact.name ||
                            contact.notify ||
                            contact.verifiedName ||
                            '-'
                          "
                          width="40"
                          height="40"
                        />

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-10 w-10"
                          viewBox="0 0 512 512"
                          v-else
                        >
                          <path
                            d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z"
                          />
                          <path
                            d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {{
                    contact.name ||
                    contact.notify ||
                    contact.verifiedName ||
                    '-'
                  }}
                </td>
                <td>{{ contact.status || '-' }}</td>
                <td>{{ formatPhoneNumber(contact.jid) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex justify-between">
          <div></div>
          <Pagination
            v-if="pagination"
            :data="pagination"
            @page-change="pageChanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>
