import { type Socket, io } from 'socket.io-client';

interface State {
  socket: Socket | null;
  token: string | null;
  needRefresh: boolean;
}

const notify = () => useNotifyStore();
const auth = () => useAuthStore();
const config = () => useRuntimeConfig();

export const useSocketStore = defineStore('socket', {
  /**
   * Returns the initial state of the application.
   *
   * @returns {State} The initial state of the application.
   */
  state: (): State => {
    return {
      socket: null,
      token: null,
      needRefresh: false,
    };
  },
  actions: {
    /**
     * Connects to the server using a WebSocket.
     *
     * @return {void} - No return value.
     */
    connect(): void {
      const host = config().public.wsHost || window.location.origin;

      this.socket = io(host, {
        withCredentials: true,
        transports: ['websocket', 'webtransport', 'polling'],
        auth: {
          token: this.token,
        },
        autoConnect: true,
      });
    },

    /**
     * Listen for a specific event and execute a callback when the event is triggered.
     *
     * @param {string} event - The name of the event to listen for.
     * @param {(...args: any[]) => void} callback - The callback function to execute when the event is triggered.
     * @return {void} This function does not return anything.
     */
    listen(event: string, callback: (...args: any[]) => void): void {
      const uuid = auth().uuid;
      const name = `${event}/${uuid}`;
      if (!uuid || !this.socket) return;

      this.socket.on(name, callback);
      console.log('Listen event', `${event}/${uuid}`);
    },

    /**
     * Closes the socket connection.
     *
     * @return {void} No return value.
     */
    close(): void {
      this.socket?.close();
    },

    /**
     * Listens for default events on the socket connection.
     *
     * @return {void} This function does not return a value.
     */
    listenDefaultEvent(): void {
      if (!this.socket) {
        return;
      }

      const lastDisconnect = ref<boolean>(false);

      this.socket.on('connect', () => {
        console.log('connected', this.socket?.id);
        this.needRefresh = lastDisconnect.value === true;
        notify().notify('Connected to server', NotificationType.Info);
      });

      this.socket.on('disconnect', () => {
        this.needRefresh = false;
        lastDisconnect.value = true;
        console.log('disconnected', this.socket?.id);
        notify().notify('Disconnected from server', NotificationType.Error);
      });

      this.socket.on('error', (err) => {
        console.error(err);
        notify().notify(err, NotificationType.Error);
      });
    },

    /**
     * Retrieves the server object.
     *
     * @return {any} The server object.
     */
    getServer() {
      return this.socket;
    },

    /**
     * Refreshes the token asynchronously.
     *
     * @return {Promise<void>} A promise that resolves when the token is refreshed.
     */
    async refreshToken(): Promise<void> {
      const { data } = await useCustomFetch<{ token: string }>(
        '/auth/refresh-ws-token',
      );

      if (data.value) {
        this.token = data.value.data.token;
      }
    },
  },
});
