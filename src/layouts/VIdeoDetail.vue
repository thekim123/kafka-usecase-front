<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Video} from "@/types/video";
import {useRoute} from "vue-router";
import {Client} from "@stomp/stompjs";

export default defineComponent({
  name: "VideoDetail",
  setup() {
    const route = useRoute();
    const videoId = route.params.videoId;


    return  {videoId}
  }
});
</script>

<template>
  <div>
    <h3>비디오 상세 정보</h3>
    <p><strong>ID:</strong> {{ this.videoId }}</p>
<!--    <p><strong>제목:</strong> {{ video.videoTitle }}</p>-->
<!--    <p><strong>파일 ID:</strong> {{ video.videoFileId }}</p>-->
<!--    <p><strong>소유자 ID:</strong> {{ video.ownerId }}</p>-->
  </div>
</template>

<style scoped>

</style>
