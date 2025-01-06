import { defineStore } from 'pinia';

interface AuthState {
  accessToken: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
  }),
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
    },
    clearAccessToken() {
      this.accessToken = null;
    },
  },

  getters: {
    isAuthenticated: (state) => {
      return !!state.accessToken;
    },
    getAccessToken: (state) => {
      return state.accessToken;
    },
  },

});
