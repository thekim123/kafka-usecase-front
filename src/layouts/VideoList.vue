<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {VideoService} from "@/services/video-service";
import {PageUtil} from "@/util/page-util";
import {Video} from "@/types/video";
import {Page} from "@/types/page";
import VideoDetail from "@/layouts/VIdeoDetail.vue"

export default defineComponent({
  name: "VideoList",
  components: {VideoDetail},
  setup() {
    const videoList = ref<Video[]>([]);
    const selectedVideo = ref<Video | null>(null); // 선택된 비디오 상태

    // Page 객체 생성
    const page: Page = PageUtil.createDefaultPage();

    // 비디오 리스트 로드
    const loadVideos = async () => {
      try {
        const list = await VideoService.fetchVideoList(page);
        videoList.value = list.content;
      } catch (error) {
        console.error("Failed to fetch video list", error);
      }
    };

    // 비디오 선택 핸들러
    const selectVideo = (video: Video) => {
      selectedVideo.value = video; // 선택된 비디오 설정
    };

    // 컴포넌트가 마운트 되었을 때 데이터 로드
    onMounted(() => {
      loadVideos();
    });

    return {videoList, selectedVideo, selectVideo};
  },
});

</script>

<template>
  <div v-if="videoList.length > 0">
    <h3>등록한 영상 목록</h3>
    <ul>
      <li v-for="item in videoList" :key="item.videoId">
        <router-link :to="`/video/${item.videoId}`">
          <p><strong>ID:</strong> {{ item.videoId }}</p>
          <p><strong>제목:</strong> {{ item.videoTitle }}</p>
        </router-link>
        <hr/>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
