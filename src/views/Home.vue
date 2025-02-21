<template>
  <div class="container">
    <div class="home">
      <h1>🖥️ 나의 정보</h1>
      <h2>ID : {{ userStore.user?.id }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useUserStore} from "@/stores/user-store";
import api from "@/services/api";
import Header from "@/layouts/Header.vue";
import BoardList from "@/layouts/BoardList.vue";
import VideoList from "@/layouts/VideoList.vue";

export default defineComponent({
  name: 'Home',
  components: {Header, BoardList, VideoList},

  setup() {
    const userStore = useUserStore();

    return {userStore};
  },

  methods: {
    logout() {
      if (!confirm('로그아웃 하시겠습니까?')) {
        return;
      }
      const response = api.delete('/auth/logout');
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
    },
  }
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: left;
}


.home {
  width: 100%;
  height: 600px;
  background-color: #f2f2f2;
  padding: 15px;
}


</style>
