import { type Socket, io } from 'socket.io-client';

interface State {
  socket: Socket | null;
  token: string | null;
}

const notify = () => useNotifyStore();
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
      });
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

      this.socket.on('connect', () => {
        console.log('connected', this.socket?.id);
        notify().notify('Connected to server', NotificationType.Info);
      });

      this.socket.on('disconnect', () => {
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
