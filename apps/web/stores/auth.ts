import { defineStore } from 'pinia';

interface State {
  uuid: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
}

interface ILogin {
  uuid: string;
  firstName: string;
  lastName: string | null;
  avatar: string | null;
}

interface ILogout {
  status: boolean;
}

interface IVerify extends ILogin, ILogout {}

const route = () => useRoute();
const notifyStore = () => useNotifyStore();

export const useAuthStore = defineStore('auth', {
  state: (): State => {
    return {
      uuid: null,
      firstName: null,
      lastName: null,
      avatar: null,
    };
  },

  actions: {
    async login(username: string, password: string) {
      const { data, error } = await useCustomFetch<ILogin>('/auth/login', {
        body: {
          username,
          password,
        },
        method: 'post',
      });

      if (error.value?.data.message) {
        notifyStore().notify(error.value.data.message, NotificationType.Error);
      } else if (error.value) {
        notifyStore().notify(error.value, NotificationType.Error);
      }

      if (!data.value) {
        return;
      }

      const redirect: string | undefined = route().query.redirect as string;
      this.uuid = data.value.data.uuid;
      this.firstName = data.value.data.firstName;
      this.lastName = data.value.data.lastName;
      this.avatar = data.value.data.avatar;
      return navigateTo(redirect || '/');
    },

    async verify() {
      const { data, error } = await useCustomFetch<IVerify>('/auth/verify');

      if (data.value?.data) {
        this.uuid = data.value.data.uuid;
        this.firstName = data.value.data.firstName;
        this.lastName = data.value.data.lastName;
        this.avatar = data.value.data.avatar;
      }

      return { error };
    },

    async logout() {
      const { data, error } = await useCustomFetch<ILogout>('/auth/logout', {
        method: 'delete',
      });

      if (data.value?.data) {
        this.uuid = null;
        this.firstName = null;
        this.lastName = null;
        this.avatar = null;

        navigateTo('/login', {
          replace: true,
          redirectCode: 307,
        });
      }

      if (error.value) {
        notifyStore().notify(error.value, NotificationType.Error);
      }
    },
  },
});
