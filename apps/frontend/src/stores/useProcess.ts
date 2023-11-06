import { defineStore, acceptHMRUpdate  } from 'pinia'
import { ref, computed } from 'vue'
import { useToasts } from './useToasts';

export const useProcess = defineStore('process', () => {
  const toast = useToasts();

  const connectionState = ref<"close" | "open" | "connecting">('close')
  const connectedAt = ref<null | Date>(null)
  const workerState = ref<"connected" | "disconnected">('disconnected')
  const workerStartedAt = ref<null | Date>(null)
  const isLoading = ref<boolean>(true);
  const isProcessConnected = computed(() => {
    return workerState.value === 'connected'
  })
  const isConnected = computed(() => {
    return connectionState.value === 'open'
  })

  const reset = () => {
    connectedAt.value = null;
    connectionState.value = "close";
    workerState.value = "disconnected";
    workerStartedAt.value = null;
  }

  function getData() {
    isLoading.value = true;
    const result = fetch(new URL("whatsapp", import.meta.env.VITE_API_URL), {
      credentials: "include",
    });

    result.catch((err) => {
      console.error(err)
      toast.dispatch({
        title: "Error",
        message: err.message ?? "Failed to fetch whatsapp status",
        type: "danger",
      });
      isLoading.value = false
      reset();
    });

    result.then(async (response) => {
      if (!response.ok) {
        toast.dispatch({
          title: "Error",
          message: "Network response is not ok",
          type: "danger",
        });
        return;
      }

      const res = (await response.json()) as any;

      connectedAt.value = res.connectedAt ? new Date(res.connectedAt) : null;
      connectionState.value = res.connectionState;
      workerState.value = res.workerState;
      workerStartedAt.value = res.workerStartedAt ? new Date(res.workerStartedAt) : null;
      isLoading.value = false;
    })
  }

  function listen() {
    console.log(import.meta.env.VITE_API_URL);
    const event = new EventSource(new URL("event/connection-state", import.meta.env.VITE_API_URL), {
      withCredentials: true,
    });
    // event.addEventListener('open', (ev) => {
    //   toast.dispatch({
    //     title: "Connection",
    //     message: "Connection opened to process state",
    //     type: "success",
    //   })
    // })
    event.addEventListener('error', (e) => {
      toast.dispatch({
        title: "Event Listener Error",
        message: "Connection error to State Event Listener",
        type: "danger",
      })
      console.error(e)
      reset();
    })
    event.addEventListener('message', (ev) => {
      toast.dispatch({
        title: "Connection",
        message: 'Receiving new message',
        type: "info",
      })
      const res = ev.data
      connectedAt.value = res.connectedAt ? new Date(res.connectedAt) : null;
      connectionState.value = res.connectionState;
      workerState.value = res.workerState;
      workerStartedAt.value = res.workerStartedAt ? new Date(res.workerStartedAt) : null;
      isLoading.value = false;
    })
  }

  return {
    connectionState,
    connectedAt,
    workerState,
    workerStartedAt,
    isLoading,
    isProcessConnected,
    isConnected,
    getData,
    listen
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProcess, import.meta.hot))
}
