import { defineStore } from 'pinia';

export interface Notification {
  message: string;
  type: NotificationType;
  notifyTime: number;
}

export enum NotificationType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

interface State {
  notifications: Notification[];
  notificationsArchive: Notification[];
}

export const useNotifyStore = defineStore('notify', {
  state: (): State => {
    return {
      notifications: [],
      notificationsArchive: [],
    };
  },
  actions: {
    /**
     * Notifies the user with a message or error of a specific type.
     *
     * @param {unknown} messageOrError - The message or error to be notified.
     * @param {NotificationType} type - The type of the notification.
     */
    notify(messageOrError: unknown, type: NotificationType) {
      const message: string =
        typeof messageOrError === 'string'
          ? messageOrError
          : messageOrError instanceof Error
          ? messageOrError.message
          : '';
      const notification: Notification = {
        message,
        type,
        notifyTime: Date.now(),
      };
      this.notifications.push(notification);
      setTimeout(this.removeNotification.bind(this), 3000, notification);
    },

    /**
     * Removes the specified notification from the list of notifications.
     *
     * @param {Notification} notification - The notification to be removed.
     */
    removeNotification(notification: Notification) {
      this.notifications = this.notifications.filter(
        (n) => n.notifyTime != notification.notifyTime,
      );
    },
  },
});
