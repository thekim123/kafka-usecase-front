<template>
  <div id="app">
    <div  v-if="showHeader">
    <h1 class="main">Hello World!</h1>
    <hr/>
    <!-- 조건부로 Header 렌더링 -->
    <Header />
    <hr/>
    </div>

    <!-- 레이아웃 구조 -->
    <div class="layout">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import Header from "@/layouts/Header.vue";

export default defineComponent({
  components: {
    Header,
  },
  setup() {
    const route = useRoute();

    // 특정 경로에서는 Header를 숨김
    const showHeader = computed(() => !['/login', '/join'].includes(route.path));

    return { showHeader };
  },
});
</script>

<style scoped>
/* 전체 레이아웃 스타일 */
#app {
  display: flex;
  width: 1080px;
  flex-direction: column;
  height: 100vh;
}

/* Header 스타일 */
.header {
  text-align: center;
  font-size: 20px;
}

.main{
  font-weight: 800;
  font-size: 50px;
  margin-top: 10px;
}

hr {
  margin-top: 10px;
  margin-bottom: 10px;
}

/* 메인 레이아웃 스타일 */
.layout {
  flex: 1; /* Header를 제외한 나머지 공간을 차지 */
  //overflow: auto; /* 내용이 많을 경우 스크롤 가능 */
  padding: 20px;
}
</style>
