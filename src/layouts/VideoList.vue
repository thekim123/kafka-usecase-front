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
      } else if (video.videoStatus === "ERROR") {
        alert("예상하지 못한 에러가 발생했습니다. 다시 작업을 시작해주세요")
      } else if (video.videoStatus === "COMPLETE") {
        router.push(`/final/${video.videoId}`);
      } else {
        router.push(`/video/${video.videoId}`);
      }
    };

    const statusTextMap: Record<string, string> = {
      REGISTERED: "처리중",
      READY: "보정 가능",
      COMPLETE: "처리 완료",
      ERROR: "오류발생"
    };

    const getStatusText = (status: string): string => statusTextMap[status] || "알 수 없음";


    const getStatusClasses = (status: string) => {
      return {
        "complete-video": status === "COMPLETE",
        "registered-video": status === "REGISTERED",
        "ready-video": status === "READY",
        "errored-video": status === "ERROR",
      };
    };


    // 컴포넌트가 마운트 되었을 때 데이터 로드
    onMounted(() => {
      loadVideos(page);
    });

    return {videoList, selectedVideo, selectVideo, loadVideos, validateVideoStatus, getStatusText, getStatusClasses};
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
          <button class="video-status" :class="getStatusClasses(item.videoStatus)">
            {{ getStatusText(item.videoStatus) }}
          </button>
          <p :class="getStatusClasses(item.videoStatus)">
            <strong>작업명:</strong> {{ item.workTitle }}
          </p>
          <p :class="getStatusClasses(item.videoStatus)">
            <strong>비디오 파일명:</strong> {{ item.videoTitle }}
          </p>
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

p {
  font-weight: 800;
}


.video-status {
  float: right; /* 맨 오른쪽 끝에 배치 */
  font-weight: bold;
  margin-top: 25px;
  border: #2c3e50;
  border-radius: 10px;
  width: 100px;
}

.complete-video {
  color: mediumpurple; /* 연한 초록색 */
}

.registered-video {
  color: deeppink; /* 연한 초록색 */
}

.ready-video {
  color: hsla(160, 100%, 37%, 1);
}

.errored-video {
  color: darkgrey;
}
</style>
