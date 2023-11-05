import { defineStore, acceptHMRUpdate  } from 'pinia'
import { ref } from 'vue'

interface IToast {
  type: 'info' | 'danger' | 'success' | 'warning' | 'primary',
  title: string,
  message: string
}

export const useToasts = defineStore('toasts',  () => {
  const data = ref<IToast[]>([])

  function dispatch(toastData: IToast) {
    data.value.push(toastData);
  }

  function reset() {
    data.value = [];
  }

  return {
    data, dispatch, reset
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToasts, import.meta.hot))
}
