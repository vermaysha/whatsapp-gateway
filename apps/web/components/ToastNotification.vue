<script setup lang="ts">
const notifyStore = useNotifyStore();
const { notifications } = storeToRefs(notifyStore);
</script>

<template>
  <div class="toast toast-end toast-top">
    <div
      v-for="notification in notifications"
      :class="{
        alert: true,
        relative: true,
        'rounded-none': true,
        'alert-success': notification.type === NotificationType.Success,
        'alert-error': notification.type === NotificationType.Error,
        'alert-warning': notification.type === NotificationType.Warning,
        'alert-info': notification.type === NotificationType.Info,
      }"
    >
      <!-- Info Icon -->
      <svg
        v-if="notification.type === NotificationType.Info"
        class="stroke-error shrink-0 w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M220 220h32v116"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="32"
          d="M208 340h88"
        />
        <path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z" />
      </svg>

      <!-- Warning icon -->
      <svg
        v-if="notification.type === NotificationType.Warning"
        class="stroke-error shrink-0 w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          d="M85.57 446.25h340.86a32 32 0 0028.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0028.17 47.17z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <path
          d="M250.26 195.39l5.74 122 5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 5.95z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <path d="M256 397.25a20 20 0 1120-20 20 20 0 01-20 20z" />
      </svg>

      <!-- Error Icon -->
      <svg
        v-if="notification.type === NotificationType.Error"
        class="stroke-error shrink-0 w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M320 320L192 192M192 320l128-128"
        />
      </svg>

      <!-- Success icon -->
      <svg
        v-if="notification.type === NotificationType.Success"
        class="stroke-error shrink-0 w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M352 176L217.6 336 160 272"
        />
      </svg>
      <div>
        <div class="text-sm mr-4">{{ notification.message }}</div>
      </div>
      <button
        class="absolute p-[2px] top-0 right-0 text-slate-50 hover:text-slate-800"
        @click.prevent="notifyStore.removeNotification(notification)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="shrink-0 w-6 h-6"
          viewBox="0 0 512 512"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M368 368L144 144M368 144L144 368"
          />
        </svg>
      </button>
    </div>
    <!-- <div v-for="notification in notifications" :class="notification.type">
      <div>
        <button
          @click.prevent="notifyStore.removeNotification(notification)"
          type="button"
          class="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <span>&nbsp;{{ notification.message }}</span>
      </div>
    </div> -->
  </div>
</template>
