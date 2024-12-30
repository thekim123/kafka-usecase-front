<template>
  <div id="app">
  <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import Header from "@/layouts/Header.vue";

export default {
  components: {
    Header,
  },
  computed: {
    showHeader() {
      const route = useRoute();
      // route 객체가 존재하는 경우에만 처리
      return route?.path && !["/login", "/signup"].includes(route.path);
    },
    showSidebar() {
      const route = useRoute();
      // route 객체가 존재하는 경우에만 처리
      return route?.path && !["/login", "/signup"].includes(route.path);
    },
  },
};
</script>

<style>
.header {
  background-color: #007bff;
  color: white;
  padding: 15px;
  text-align: center;
}

.layout {
  display: flex;
  height: calc(100vh - 50px); /* 헤더 높이를 제외한 나머지 */
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>
