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
        'text-white': true,
      }"
    >
      <!-- Info Icon -->
      <ion-icon
        name="information-circle-outline"
        class="text-2xl"
        v-if="notification.type === NotificationType.Info"
      ></ion-icon>

      <!-- Warning icon -->
      <ion-icon
        name="warning-outline"
        class="text-2xl"
        v-if="notification.type === NotificationType.Warning"
      ></ion-icon>

      <!-- Error Icon -->
      <ion-icon
        name="alert-circle-outline"
        class="text-2xl"
        v-if="notification.type === NotificationType.Error"
      ></ion-icon>

      <!-- Success icon -->
      <ion-icon
        name="checkmark-circle-outline"
        class="text-2xl"
        v-if="notification.type === NotificationType.Success"
      ></ion-icon>
      <div>
        <div class="text-sm mr-4">{{ notification.message }}</div>
      </div>
      <button
        class="absolute p-[2px] top-0 right-0 text-slate-50 hover:text-slate-800"
        @click.prevent="notifyStore.removeNotification(notification)"
      >
        <ion-icon name="close-circle-outline" class="text-2xl"></ion-icon>
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
