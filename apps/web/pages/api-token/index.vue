<script setup lang="ts">
import type { IPagination } from 'composables/useCustomFetch';
import dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as AdvancedFormat from 'dayjs/plugin/advancedFormat'; // ES 2015
import 'dayjs/locale/id';

dayjs.locale('id');
dayjs.extend(AdvancedFormat); // use plugin
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

interface IQuery {
  search: string | null;
  page: number;
}
interface IAPIHistory {
  ip: string | null;
  userAgent: string | null;
  updatedAt: string | null;
}
interface IAPIToken {
  id: string;
  name: string;
  description: string | null;
  expiredAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  history: IAPIHistory[];
}
interface IAPITokenData extends IAPIToken {
  token: string;
}

useHead({
  title: 'API Token',
});

const notifyStore = useNotifyStore();
const socketStore = useSocketStore();

const loading = ref(true);
const apiTokens = ref<IAPIToken[]>([]);
const pagination = ref<IPagination>();
const query = reactive<IQuery>({
  search: null,
  page: 1,
});
const modal = ref<{
  show: boolean;
}>({
  show: false,
});
const deleteModal = ref<{
  show: boolean;
  name: null | string;
  id: null | string;
}>({
  show: false,
  name: null,
  id: null,
});
const success = ref<{
  show: boolean;
  data: string;
}>({
  show: false,
  data: '',
});
const apiTokenData = ref<{
  name: string | null;
  description: string | undefined;
  expiredAt: string;
}>({
  name: null,
  description: undefined,
  expiredAt: '',
});

async function fetchData() {
  loading.value = true;
  const { data, error } = await useCustomFetch<IAPIToken[]>('/api-token', {
    query,
  });

  if (data.value) {
    apiTokens.value = data.value.data;
    pagination.value = data.value.pagination;
  }

  if (error.value) {
    notifyStore.notify(error.value.data.reason, NotificationType.Error);
  }
  loading.value = false;
}

onMounted(() => {
  fetchData();
});

function pageChanged(page: number) {
  query.page = page;
}

async function deleteToken(uuid: string | null) {
  if (!uuid) {
    notifyStore.notify('Token not found', NotificationType.Error);
    return;
  }

  const { data, error } = await useCustomFetch(`/api-token/${uuid}`, {
    method: 'DELETE',
  });

  if (data.value) {
    notifyStore.notify(
      `Token ${deleteModal.value.name} has been deleted`,
      NotificationType.Success,
    );
    deleteModal.value.id = null;
    deleteModal.value.name = null;
    deleteModal.value.show = false;
    fetchData();
  }

  if (error.value) {
    notifyStore.notify(error.value.data.reason, NotificationType.Error);
  }
}

function openDeleteModal(id: string, name: string) {
  deleteModal.value.id = id;
  deleteModal.value.name = name;
  deleteModal.value.show = true;
}

async function generateToken() {
  const expiredAt = dayjs(
    apiTokenData.value.expiredAt,
    'DD MMMM YYYY',
    'id',
    true,
  )
    .set('hour', 23)
    .set('minute', 59)
    .set('second', 59)
    .set('millisecond', 999)
    .toDate();
  const name = apiTokenData.value.name;
  const description = apiTokenData.value.description;

  const { data, error } = await useCustomFetch<IAPITokenData>('/api-token', {
    method: 'POST',
    body: {
      name,
      description,
      expiredAt,
    },
  });

  if (data.value) {
    success.value.show = true;
    success.value.data = data.value.data.token;
    modal.value.show = false;

    apiTokenData.value = {
      name: null,
      description: undefined,
      expiredAt: '',
    };

    fetchData();
  }

  if (error.value) {
    notifyStore.notify(error.value.data.reason, NotificationType.Error);
  }
}

/**
 * Closes the modal.
 *
 * @param {void} - This function does not take any parameters.
 * @return {void} - This function does not return any value.
 */
function closeModal(): void {
  modal.value.show = !modal.value.show;
}
</script>
<template>
  <div>
    <div
      class="flex justify-between items-center border-b p-4 bg-base-100 rounded"
    >
      <div class="mb-4 flex items-center">
        <ion-icon name="key-outline" class="text-2xl mr-2"></ion-icon>
        <h1 class="text-xl font-bold">API Token</h1>
      </div>
      <div class="text-sm breadcrumbs">
        <ul>
          <li>
            <NuxtLink href="/">Home</NuxtLink>
          </li>
          <li>API Token</li>
        </ul>
      </div>
    </div>
    <div class="m-4" v-if="success.show">
      <div class="alert alert-success relative rounded-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span
          >New token has been generated, please copy and save to safe place
          <code>{{ success.data }}</code></span
        >
        <button
          class="absolute p-[px] right-2 text-slate-50 hover:text-slate-800"
          @click="success.show = false"
        >
          <ion-icon name="close-circle-outline" class="text-4xl"></ion-icon>
        </button>
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
              v-model="query.search"
              type="text"
              placeholder="Seach here"
              class="input input-sm w-full max-w-xs join-item input-bordered focus:outline-none"
            />
          </div>
          <button
            class="btn btn-sm btn-info btn-outline"
            @click="modal.show = true"
          >
            Add
            <ion-icon name="add-outline" class="text-xl"></ion-icon>
          </button>
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
                <th>Name</th>
                <th>Description</th>
                <th>Expiration</th>
                <th>Last accesses</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="hover rounded"
                v-for="token in apiTokens"
                :key="token.id"
              >
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <td>{{ token.name }}</td>
                <td>{{ token.description?.substring(0, 50) }}</td>
                <td>
                  <div v-if="token.expiredAt">
                    {{ formatDate(token.expiredAt) }}
                  </div>
                  <div v-else>
                    <div class="badge badge-outline badge-warning">
                      No Expiration
                    </div>
                  </div>
                </td>
                <td>
                  <div v-if="token.history[0]?.updatedAt">
                    {{ formatDate(token.history[0].updatedAt) }}
                  </div>
                  <div v-else class="badge badge-primary badge-outline">
                    Never Accessed
                  </div>
                </td>
                <td>
                  <div class="join">
                    <div class="tooltip tooltip-info" data-tip="Detail">
                      <NuxtLink
                        :href="`/api-token/info?uuid=${token.id}`"
                        class="btn btn-outline btn-sm btn-info join-item"
                      >
                        <ion-icon
                          name="infinite-outline"
                          class="text-xl"
                        ></ion-icon>
                      </NuxtLink>
                    </div>
                    <div class="tooltip tooltip-error" data-tip="Delete Token">
                      <button
                        class="btn btn-outline btn-sm btn-error join-item"
                        @click="openDeleteModal(token.id, token.name)"
                      >
                        <ion-icon
                          name="close-outline"
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
          <Pagination
            v-if="pagination"
            :data="pagination"
            @page-change="pageChanged"
          />
        </div>
      </div>
    </div>
    <!-- Generate Token Modal -->
    <div
      :class="{
        modal: true,
        'modal-open': modal.show,
      }"
    >
      <div class="modal-box w-5/12 max-w-5xl">
        <h3 class="font-bold text-lg border-b pb-2 text-center">
          Generate new API Token
        </h3>
        <form action="" class="mt-3">
          <div class="mb-5">
            <label class="mb-2.5 block text-primary">
              Name <span class="text-error">*</span>
            </label>
            <input
              v-model="apiTokenData.name"
              type="text"
              placeholder="API Token name"
              class="input w-full input-bordered focus:outline-none focus:border-primary active:border-primary"
            />
          </div>
          <div class="mb-5">
            <label class="mb-2.5 block text-primary"> Expired At </label>
            <vue-tailwind-datepicker
              v-model="apiTokenData.expiredAt"
              placeholder="API Token Expiration date"
              as-single
              :start-from="new Date()"
              :disable-date="(date: Date) => date < new Date()"
              :formatter="{ date: 'DD MMMM YYYY', month: 'MMM' }"
              i18n="id"
            />
          </div>
          <div class="mb-5">
            <label class="mb-2.5 block text-primary"> Description </label>
            <textarea
              v-model="apiTokenData.description"
              placeholder="API Token description"
              class="textarea w-full textarea-bordered focus:outline-none focus:border-primary active:border-primary"
            ></textarea>
          </div>
          <div class="modal-action">
            <button
              type="reset"
              class="btn btn-sm btn-outline btn-error"
              @click="closeModal"
            >
              Close
            </button>
            <button
              type="submit"
              class="btn btn-sm btn-outline btn-primary"
              @click.prevent.stop="generateToken"
              @submit.prevent.stop="generateToken"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- /Generate Token Modal -->

    <!-- Delete Token Model -->
    <div
      :class="{
        modal: true,
        'modal-open': deleteModal.show,
      }"
    >
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4 text-center">
          Are you sure to delete token below ?
        </h3>
        <div class="text-center">{{ deleteModal.name }}</div>
        <div class="modal-action justify-between">
          <button
            @click="deleteModal.show = false"
            class="btn btn-error btn-sm btn-outline text-white"
          >
            No
          </button>
          <button
            @click="deleteToken(deleteModal.id)"
            class="btn btn-primary btn-sm btn-outline text-white"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
    <!-- /Delete Token modal -->
  </div>
</template>
