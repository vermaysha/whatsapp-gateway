<template>
  <div class="join" v-if="data.lastPage > 1">
    <button
      v-if="data.prev"
      class="join-item btn btn-sm btn-outline btn-info"
      @click="goToPage(1)"
    >
      <span class="sr-only">First Page</span>
      &lt;&lt;
    </button>
    <button
      v-if="data.prev"
      class="join-item btn btn-sm btn-outline btn-info"
      @click="goToPage(data.prev)"
    >
      <span class="sr-only">Prev Page</span>
      &lt;
    </button>
    <button
      v-for="page in visiblePages"
      :key="page"
      class="join-item btn btn-sm"
      :class="{
        'btn-outline btn-info': page !== data.currentPage,
        'btn-active': page === data.currentPage,
      }"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>
    <button
      v-if="hasEllipsisAfter"
      class="join-item btn btn-sm btn-outline btn-info"
    >
      ...
    </button>
    <button
      v-if="data.next"
      class="join-item btn btn-sm btn-outline btn-info"
      @click="goToPage(data.next)"
    >
      <span class="sr-only">Next Page</span>
      &gt;
    </button>
    <button
      v-if="data.next"
      class="join-item btn btn-sm btn-outline btn-info"
      @click="goToPage(data.lastPage)"
    >
      <span class="sr-only">Last Page</span>
      &gt;&gt;
    </button>
  </div>
</template>

<script setup lang="ts">
import type { IPagination } from 'composables/useCustomFetch';

const props = defineProps<{
  data: IPagination;
}>();

const visiblePages = ref<number[]>([]);
const hasEllipsisAfter = computed(
  () => visiblePages.value[visiblePages.value.length - 1] < props.data.lastPage,
);

const emit = defineEmits();

const goToPage = (page: number) => {
  if (page !== null) {
    emit('page-change', page);
  }
};

const updateVisiblePages = () => {
  const { currentPage, lastPage } = props.data;
  const range = 2;

  const startPage = Math.max(currentPage - range, 1);
  const endPage = Math.min(currentPage + range, lastPage);

  visiblePages.value = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.value.push(i);
  }
};

updateVisiblePages();
</script>

<style>
/* ... (add your styling here) ... */
</style>
