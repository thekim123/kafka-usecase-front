<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username"/>
      <input v-model="password" type="password" placeholder="Password"/>
      <span style="display: flex; flex-direction: row">
        <button type="submit">Login</button>
        <router-link :to="'/join'">
          <button type="button">Join</button>
        </router-link>
      </span>
    </form>

    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import api from '../services/api'; // Axios 설정 파일
import {useAuthStore} from '@/stores/auth-store';
import {useStompStore} from "@/stores/stomp-store"; // Pinia 상태 관리

export default defineComponent({
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const handleLogin = async () => {
      try {
        const response = await api.post('/auth/login', {
          username: username.value,
          password: password.value,
        });

        // 액세스 토큰 저장
        const {access} = response?.data.body || {};
        authStore.setAccessToken(access);

        // nextTick을 사용해 상태 업데이트 이후 라우팅
        await nextTick();

        // redirect 처리
        let redirect = route.query.redirect;
        if (Array.isArray(redirect)) {
          redirect = redirect[0]; // 배열이면 첫 번째 값 사용
        }
        router.push(redirect && typeof redirect === 'string' ? redirect : '/');
      } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Login failed!';
      }
    };

    return {username, password, errorMessage, handleLogin};
  },
});

</script>

<style scoped>
.login {
  width: 300px;
  height: 300px;
  background-color: #00bd7e;
  padding: 20px;
  color: white;
  font-size: 20px;
  font-weight: bold;
}
</style>
