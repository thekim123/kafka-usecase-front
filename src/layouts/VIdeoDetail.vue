<script lang="ts">
import {defineComponent, ref, nextTick, watchEffect, onMounted} from "vue";
import {useRoute} from "vue-router";
import VideoTimeline from "@/components/VideoTimeline.vue";
import {VideoService} from "@/services/video-service";
import {useKeyboardControl} from "@/composable/use-keyboard-control";
import {useVideoPlayer} from "@/composable/use-video-player";
import type {TimelineMetadata, VideoDetail} from "@/types/video";
import {useCanvasMosaic} from "@/composable/use-canvas-mosaic";
import {Rect} from "@/types/rect";
import {useMosaicStore} from "@/stores/mosaic-store";

export default defineComponent({
  name: "VideoDetail",
  components: {VideoTimeline},
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

    // 모자이크 박스 저장 배열
    const mosaicStore = useMosaicStore();
    const {mosaicRects, setMosaicRects, init} = useCanvasMosaic(canvasElement, currentFrameSequence);

    // 키보드 이벤트 핸들러
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          moveFrameWithMosaic('PREVIOUS');
          break;
        case "ArrowRight":
          moveFrameWithMosaic('NEXT');
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
          await captureFrame(currentFrameSequence.value);

          if (videoElement.value && canvasElement.value) {
            canvasElement.value.width = videoElement.value.videoWidth;
            canvasElement.value.height = videoElement.value.videoHeight;

            init();
          }
        });
      }


      await mosaicStore.loadRects(videoId);
      console.log(currentFrameSequence.value);
      await changeFrame(currentFrameSequence.value);
      const mosaics = mosaicStore.getMosaics(currentFrameSequence.value);
      setMosaicRects(mosaics);
    });

    // 타임라인 썸네일 클릭 시 프레임 변경
    const onFrameSelected = async (frameSequence: number) => {
      await saveMosaicRects();
      await changeFrame(frameSequence);
      const mosaics = mosaicStore.getMosaics(frameSequence);
      setMosaicRects(mosaics);
    };

    const saveMosaicRects = async () => {
      console.log(`mosaicRects: ${JSON.stringify(mosaicRects.value)}`);
      if (mosaicRects.value.length > 0) {
        mosaicStore.pushMosaicArray(currentFrameSequence.value, [...mosaicRects.value]);
      }
    }

    const moveFrameWithMosaic = async (direction: 'NEXT' | 'PREVIOUS'): Promise<void> => {
      await saveMosaicRects();
      if (direction === 'NEXT') {
        await nextFrame(totalFrameCount.value);
      } else if (direction === 'PREVIOUS') {
        await prevFrame();
      }
      const mosaics = mosaicStore.getMosaics(currentFrameSequence.value);
      setMosaicRects(mosaics);
    }

    const onEditingComplete = async () => {
      await mosaicStore.saveAllMosaics(videoId);
    }

    return {
      video,
      videoSrc,
      totalFrameCount,
      timelineFrames,
      videoElement,
      canvasElement,
      currentFrameSequence,
      onFrameSelected,
      mosaicRects,
      saveMosaicRects,
      moveFrameWithMosaic,
      onEditingComplete,
    };
  },
});
</script>

<template>
  <div>
    <h3>비디오 상세 정보</h3>
    <p v-if="video"><strong>작업명:</strong> {{ video.workTitle }}</p>
    <p v-if="video"><strong>비디오 파일명:</strong> {{ video.videoTitle }}</p>
    <button @click="saveMosaicRects">모자이크 저장</button>
    <button @click="onEditingComplete">완료</button>
    <div class="video-container">
      <button @click="moveFrameWithMosaic('PREVIOUS')" :disabled="currentFrameSequence === 0">◀️</button>
      <div class="frame-container" style="position: relative;">
        <video ref="videoElement" crossorigin="anonymous" :src="videoSrc"/>
        <canvas ref="canvasElement"
                style="position: absolute; top: 0; left: 0; pointer-events: auto;"
        />
      </div>
      <button @click="moveFrameWithMosaic('NEXT')" :disabled="currentFrameSequence === totalFrameCount - 1">▶️</button>
    </div>
    <VideoTimeline :timelineFrames="timelineFrames" @frameSelected="onFrameSelected"/>
  </div>
</template>
