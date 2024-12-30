<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link v-if="!auth.isAuthenticated" to="/login">Login</router-link>
      <button v-if="auth.isAuthenticated" @click="logout">Logout</button>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  setup() {
    const auth = useAuthStore();

    const logout = () => {
      auth.clearTokens();
      window.location.href = '/login';
    };

    return { auth, logout };
  },
});
</script>
