<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {VideoService} from "@/services/video-service";
import {PageUtil} from "@/util/page-util";
import {Video} from "@/types/video";
import {Page} from "@/types/page";
import VideoDetail from "@/layouts/VIdeoDetail.vue"
import VideoRegisterModal from "@/components/VideoRegisterModal.vue";
import {useVideoStore} from "@/stores/video-store";

export default defineComponent({
  name: "VideoList",
  components: {VideoDetail, VideoRegisterModal},
  data() {
    return {
      isModalOpen: false, // 모달 열림 상태
    };
  },
  setup() {
    const videoStore = useVideoStore();
    // const videoList = ref<Video[]>([]);
    const {videoList, loadVideos} = videoStore;
    const selectedVideo = ref<Video | null>(null); // 선택된 비디오 상태

    // Page 객체 생성
    const page: Page = PageUtil.createDefaultPage();

    // 비디오 선택 핸들러
    const selectVideo = (video: Video) => {
      selectedVideo.value = video; // 선택된 비디오 설정
    };

    // 컴포넌트가 마운트 되었을 때 데이터 로드
    onMounted(() => {
      loadVideos(page);
    });

    return {videoList, selectedVideo, selectVideo, loadVideos};
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
});

</script>

<template>
  <div v-if="videoList.length > 0">
    <section class="video-title-section">
      <h3>작업 목록</h3>
      <button @click="openModal">새로운 작업 시작</button>
      <VideoRegisterModal v-if="isModalOpen"
                          @close="closeModal"
                          @video-registered="loadVideos"
      />
    </section>
    <ul>
      <li v-for="item in videoList" :key="item.videoId">
        <router-link :to="`/video/${item.videoId}`">
          <p><strong>작업명:</strong> {{ item.workTitle }}</p>
          <p><strong>비디오 파일명:</strong> {{ item.videoTitle }}</p>
        </router-link>
        <hr/>
      </li>
    </ul>
  </div>
  <div v-else>
    <section class="video-title-section">
      <h3>작업 목록</h3>
      <button @click="openModal">새로운 작업 시작</button>
      <VideoRegisterModal v-if="isModalOpen"
                          @close="closeModal"
                          @video-registered="loadVideos"
      />
    </section>
    <ul>
      <li>
        새로운 작업을 시작해봅시다!!!!!!
        <hr/>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.video-title-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
