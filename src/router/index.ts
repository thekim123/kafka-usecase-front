import {createRouter, createWebHistory} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Join from '../views/Join.vue'
import {useAuthStore} from "@/stores/auth";
import api from "@/services/api";

const routes = [
  {path: '/', name: 'Home', component: Home},
  {path: '/login', name: 'Login', component: Login},
  {path: '/join', name: 'Join', component: Join},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!(to.name === 'Join' || to.name === 'Login') && !authStore.isAuthenticated) {
    try {
      const response = await api.post('/auth/refresh', {}, {withCredentials: true});
      const accessToken = response?.data?.access || {};

      if (accessToken) {
        authStore.setAccessToken(accessToken);
        next();
      } else {
        throw new Error('Access Token is missing');
      }
    } catch (error) {
      console.error('❌ 토큰 재발급 실패:', error.response?.data || error.message);
      next({name: 'Login'});
    }
  } else {
    next();
  }
});

export default router;
