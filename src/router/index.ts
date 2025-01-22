import {createRouter, createWebHistory} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Join from '../views/Join.vue';
import {useAuthStore} from '@/stores/auth-store';
import api from '@/services/api';
import Converter from '@/layouts/Converter.vue';
import BoardList from '@/layouts/BoardList.vue';
import {AxiosError} from 'axios';
import VideoList from "@/layouts/VideoList.vue";
import VideoDetail from "@/layouts/VIdeoDetail.vue"

const routes = [
  {path: '/', name: 'Home', component: Home},
  {path: '/login', name: 'Login', component: Login},
  {path: '/join', name: 'Join', component: Join},
  {path: '/board', name: 'Board', component: BoardList},
  {path: '/convert', name: 'Convert', component: Converter},
  {path: '/videos', name: 'VideoList', component: VideoList},
  {path: '/video/:videoId', name: 'VideoDetail', component: VideoDetail}
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
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('❌ 토큰 재발급 실패:', error.response?.data || error.message);
      } else {
        console.error('❌ 예상치 못한 오류:', error);
      }
      next({name: 'Login'});
    }
  } else {
    next();
  }
});

export default router;
