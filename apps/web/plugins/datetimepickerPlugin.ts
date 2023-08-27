import VueTailwindDatepicker from 'vue-tailwind-datepicker';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTailwindDatepicker);
});
