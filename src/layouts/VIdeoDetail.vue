<script lang="ts">
import {defineComponent, ref, nextTick, watchEffect, onMounted} from "vue";
import { useRoute } from "vue-router";
import VideoTimeline from "@/components/VideoTimeline.vue";
import { VideoService } from "@/services/video-service";
import { useKeyboardControl } from "@/composable/use-keyboard-control";
import { useVideoPlayer } from "@/composable/use-video-player";
import type { TimelineMetadata, VideoDetail } from "@/types/video";

export default defineComponent({
  name: "VideoDetail",
  components: { VideoTimeline },
  setup() {
    const route = useRoute();
    const rawVideoIdParam = route.params.videoId;
    const videoId = Array.isArray(rawVideoIdParam) ? rawVideoIdParam[0] : rawVideoIdParam;

    // 비디오 상세 정보
    const video = ref<VideoDetail | null>(null);
    const videoSrc = ref('');
    const totalFrameCount = ref(0);
    const fps = ref(30);

    // 타임라인 데이터
    const timelineFrames = ref<TimelineMetadata[]>([]);

    // 비디오 플레이어 관련 로직 분리
    const {
      videoElement,
      canvasElement,
      currentFrameSequence,
      captureFrame,
      changeFrame,
      prevFrame,
      nextFrame,
    } = useVideoPlayer(fps.value);

    // 키보드 이벤트 핸들러
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          prevFrame();
          break;
        case "ArrowRight":
          nextFrame(totalFrameCount.value);
          break;
        case "X":
          // drawMosaic(); // 모자이크 그리기 로직도 별도 처리 가능
          break;
      }
    };
    useKeyboardControl(handleKeyDown);

    // 비디오와 타임라인 데이터를 가져오는 로직
    onMounted(async () => {
      video.value = await VideoService.fetchVideoDetail(videoId);
      if (video.value) {
        totalFrameCount.value = video.value.totalFrameCount;
        fps.value = video.value.fps;
        videoSrc.value = video.value.videoInfo.filePath;
      }

      await nextTick();

      if (videoElement.value) {
        videoElement.value.addEventListener('loadedmetadata', async () => {
          timelineFrames.value = await VideoService.fetchTimelineMetadata(videoId);
          // 초기 프레임 캡처 (예: 첫 프레임)
          await captureFrame(30);
        });
      }
    });

    // 타임라인 썸네일 클릭 시 프레임 변경
    const onFrameSelected = async (frameSequence: number) => {
      await changeFrame(frameSequence);
    };

    watchEffect(() => {
      console.log(`현재 프레임: ${currentFrameSequence.value}`);
    });

    return {
      video,
      videoSrc,
      totalFrameCount,
      timelineFrames,
      videoElement,
      canvasElement,
      currentFrameSequence,
      prevFrame,
      nextFrame,
      onFrameSelected,
    };
  },
});
</script>

<template>
  <div>
    <h3>비디오 상세 정보</h3>
    <p v-if="video"><strong>작업명:</strong> {{ video.workTitle }}</p>
    <p v-if="video"><strong>비디오 파일명:</strong> {{ video.videoTitle }}</p>
    <div class="video-container">
      <button @click="prevFrame" :disabled="currentFrameSequence === 0">◀️</button>
      <div class="frame-container">
        <video ref="videoElement" :src="videoSrc" crossorigin="anonymous" controls></video>
        <canvas ref="canvasElement"></canvas>
      </div>
      <button @click="nextFrame(totalFrameCount)" :disabled="currentFrameSequence === totalFrameCount - 1">▶️</button>
    </div>
    <VideoTimeline :timelineFrames="timelineFrames" @frameSelected="onFrameSelected" />
  </div>
</template>
