<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { VideoService } from "@/services/video-service";
import { AttachFile } from "@/types/attach-file";
import type {VideoDetail} from "@/types/video.ts";

export default defineComponent({
  name: "VideoDownload",
  components: {},
  setup() {
    const route = useRoute();
    const rawVideoIdParam = route.params.videoId;
    const videoId = Array.isArray(rawVideoIdParam) ? rawVideoIdParam[0] : rawVideoIdParam;

    // 비디오 상세 정보
    const file = ref<AttachFile | null>(null);
    const video = ref<VideoDetail | null>(null);

    // 비디오와 타임라인 데이터를 가져오는 로직
    onMounted(async () => {
      file.value = await VideoService.fetchFinalVideo(videoId);
      video.value = await VideoService.fetchVideoDetail(videoId);
    });

    // 다운로드 기능
    const downloadVideo = () => {
      if (file.value && file.value.filePath) {
        const link = document.createElement("a");
        link.href = file.value.filePath;
        link.download = file.value.fileName || "final-video.mp4"; // 파일명 설정
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    return {
      file,
      video,
      downloadVideo,
    };
  },
});
</script>

<template>
  <div>
    <h3>비디오 상세 정보</h3>
    <p v-if="file"><strong>비디오 파일명:</strong> {{ file.fileName }}</p>
    <p v-if="video"><strong>작업명:</strong> {{ video.workTitle }}</p>
    <!-- 다운로드 버튼 -->
    <button v-if="file" @click="downloadVideo">📥  최종 영상 다운로드</button>

    <div class="video-container"></div>
  </div>
</template>

<style scoped>
button {
  background-color: pink;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 800;
  margin-top: 10px;
}

button:hover {
  background-color: lightpink;
}
</style>
