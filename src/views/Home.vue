<template>
  <div>
    <h1>Welcome to the Home Page</h1>
    <p>This is the main landing page.</p>
    <button @click="logout">logout</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import api from "@/services/api";

export default defineComponent({
  name: 'Home',

  methods:{
    logout(){
      if(!confirm('로그아웃 하시겠습니까?')){
        return;
      }
      const response = api.delete('/auth/logout');
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
    },
  }
});
</script>
