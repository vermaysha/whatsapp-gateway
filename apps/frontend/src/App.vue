<script setup lang="ts"></script>

<template>
  <div>
    <RouterView />
    <div
      class="toast-container position-fixed top-0 end-0 mt-5 me-3"
      ref="toastContainer"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { useToasts } from "./stores/useToasts";
import { onMounted, ref, watch } from "vue";
import { Toast } from "bootstrap";
const toast = useToasts();

const toastContainer = ref<HTMLElement | Element | null>(null);

toast.$subscribe(
  (mutation, state) => {
    if (state.data?.length > 0) {
      state.data.forEach((data) => {
        const el = document.createElement("div");
        el.classList.add("toast", "align-items-center", `text-bg-${data.type}`, 'animate__animated', 'animate__backInRight');
        // el.style.setProperty('--animate-duration', '1s');
        el.setAttribute("role", "alert");
        el.setAttribute("aria-live", "assertive");
        el.setAttribute("aria-atomic", "true");

        el.innerHTML = `
        <div class="toast-header">
          <strong class="me-auto">${data.title}</strong>
          <button type="button" class="ms-2 btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${data.message}
        </div>`;

        toastContainer.value?.appendChild(el);

        const toast = new Toast(el, {
          animation: true,
          autohide: false,
          delay: 3000,
        });
        toast.show();

        setTimeout(() => {
          el.classList.remove('animate__backInRight')
          el.classList.add('animate__backOutRight')
          const callback = () => {
            el.remove();
            el.removeEventListener('animationend', callback)
          }
          el.addEventListener('animationend', callback, {
            once: true
          });
        }, 3000)


      });
      toast.reset();
    }
  },
  {
    detached: true,
  },
);
</script>
