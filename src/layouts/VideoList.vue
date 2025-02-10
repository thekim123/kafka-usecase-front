<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {PageUtil} from "@/util/page-util";
import {Video} from "@/types/video";
import {Page} from "@/types/page";
import VideoDetail from "@/layouts/VIdeoDetail.vue"
import VideoRegisterModal from "@/components/VideoRegisterModal.vue";
import {useVideoStore} from "@/stores/video-store";
import router from "@/router";

export default defineComponent({
  name: "VideoList",
  components: {VideoDetail, VideoRegisterModal},
  data() {
    return {
      isModalOpen: false, // 모달 열림 상태
    };
  },
  setup() {
    console.log('video list console log');
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

    const validateVideoStatus = (video: Video) => {
      if (video.videoStatus === "REGISTERED") {
        alert("아직 작업에 필요한 작업을 하는중이에요.")
      } else {
        router.push(`/video/${video.videoId}`);
      }
    }

    // 컴포넌트가 마운트 되었을 때 데이터 로드
    onMounted(() => {
      loadVideos(page);
    });

    return {videoList, selectedVideo, selectVideo, loadVideos, validateVideoStatus};
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
        <a @click.prevent="validateVideoStatus(item)">
          <p><strong>작업명:</strong> {{ item.workTitle }}</p>
          <p><strong>비디오 파일명:</strong> {{ item.videoTitle }}</p>
        </a>
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
