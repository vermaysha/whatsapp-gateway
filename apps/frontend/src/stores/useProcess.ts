import { defineStore, acceptHMRUpdate  } from 'pinia'
import { ref, computed } from 'vue'
import { useToasts } from './useToasts';
import { destr } from 'destr'
import { ofetch } from 'ofetch'

export const useProcess = defineStore('process', () => {
  const toast = useToasts();

  const connectionState = ref<"close" | "open" | "connecting">('close')
  const connectedAt = ref<null | Date>(null)
  const workerState = ref<"connected" | "disconnected">('disconnected')
  const workerStartedAt = ref<null | Date>(null)
  const isLoading = ref<boolean>(true);
  const hasSession = ref<boolean>(false);
  const qr = ref<string | null>(null);
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
    hasSession.value = false;
  }

  function getData() {
    isLoading.value = true;
    const result = ofetch('/whatsapp', {
      baseURL: import.meta.env.VITE_API_URL,
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

    result.then(async (res) => {
      connectedAt.value = res.connectedAt ? new Date(res.connectedAt) : null;
      connectionState.value = res.connectionState;
      workerState.value = res.workerState;
      workerStartedAt.value = res.workerStartedAt ? new Date(res.workerStartedAt) : null;
      hasSession.value = res.hasSession;
      qr.value = res.qr;
      isLoading.value = false;
    })
  }

  function listen() {
    const event = new EventSource(new URL("event/connection-state", import.meta.env.VITE_API_URL), {
      withCredentials: true,
    });
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
      const res = destr<any>(ev.data)
      connectedAt.value = res.connectedAt ? new Date(res.connectedAt) : null;
      connectionState.value = res.connectionState;
      workerState.value = res.workerState;
      workerStartedAt.value = res.workerStartedAt ? new Date(res.workerStartedAt) : null;
      hasSession.value = res.hasSession;
      isLoading.value = false;
    })
  }

  return {
    connectionState,
    connectedAt,
    workerState,
    workerStartedAt,
    hasSession,
    qr,
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
