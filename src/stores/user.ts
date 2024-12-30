import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
  },
  getters: {
    isLoggedIn: (state): boolean => !!state.user,
  },
});
