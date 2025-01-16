<template>
  <header>
    <nav>
      <div class="nav-bar">
        <router-link :to="{ name: 'Home' }">Home</router-link>
        <router-link :to="{ name: 'Board' }">Board</router-link>
        <router-link :to="{ name: 'Convert' }">Converter</router-link>
        <router-link :to="{ name: 'VideoList' }">VideoList</router-link>
      </div>
      <div class="btn">
        <router-link class="login-btn" v-if="!auth.isAuthenticated" :to="{ name: 'Login' }">Login</router-link>
        <button class="logout-btn" v-if="auth.isAuthenticated" @click="logout">Logout</button>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useAuthStore} from '@/stores/auth';
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const auth = useAuthStore();
    const router = useRouter();

    const logout = () => {
      auth.clearAccessToken();
      router.push({ name: 'Login' }); // Vue Router로 리다이렉트
    };

    return {auth, logout};
  },
});
</script>

<style scoped>
nav{
  display: flex;
  justify-content: space-between;
}

.nav-bar{
  display: flex;
  justify-content: left;
}

.btn{
  display: flex;
  justify-content: right;
}

.login-btn,
.logout-btn {
  text-align: center;
  margin-top: 2px;
  font-size: large;
  background-color: #00bd7e;
  border-radius: 5px;
  color: white;
  width: 80px;
  height: 30px;
}

</style>
