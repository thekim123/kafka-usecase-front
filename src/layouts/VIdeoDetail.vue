<script lang="ts">
import {defineComponent, nextTick, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import VideoTimeline from "@/components/VideoTimeline.vue";
import {VideoService} from "@/services/video-service";
import {useKeyboardControl} from "@/composable/use-keyboard-control";
import {useVideoPlayer} from "@/composable/use-video-player";
import type {TimelineMetadata, VideoDetail} from "@/types/video";
import {useCanvasMosaic} from "@/composable/use-canvas-mosaic";
import {useMosaicStore} from "@/stores/mosaic-store";

export default defineComponent({
  name: "VideoDetail",
  components: {VideoTimeline},
  setup() {
    const route = useRoute();
    const rawVideoIdParam = route.params.videoId;
    const videoId = Array.isArray(rawVideoIdParam) ? rawVideoIdParam[0] : rawVideoIdParam;
    const originalMosaics = ref<Record<number, Rect[]>>({});  // 원본 좌표


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
          // await captureFrame(currentFrameSequence.value);

          if (videoElement.value && canvasElement.value) {
            canvasElement.value.width = videoElement.value.videoWidth;
            canvasElement.value.height = videoElement.value.videoHeight;

            init();
          }
        });
      }


      await mosaicStore.loadRects(videoId);
      // console.log(currentFrameSequence.value);
      originalMosaics.value = JSON.parse(JSON.stringify(mosaicStore.mosaics));

      await changeFrame(1);
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
      await saveMosaicRects(); // 현재 프레임의 수정 정보 저장
      await mosaicStore.saveAllMosaics(videoId);
    }

    // 모든 프레임 변경사항 초기화: 서버 원본 데이터를 재로딩하여 전체를 복원
    const resetAllMosaics = async () => {
      await mosaicStore.loadRects(videoId);
      // 원본 데이터를 originalMosaics에 다시 업데이트 (필요시)
      originalMosaics.value = JSON.parse(JSON.stringify(mosaicStore.mosaics));
      const mosaics = mosaicStore.getMosaics(currentFrameSequence.value);
      setMosaicRects(mosaics);
    };

    // 현재 프레임 변경사항 초기화: 현재 프레임의 데이터만 원본으로 복원
    const resetCurrentMosaics = () => {
      const originalForCurrent = originalMosaics.value[currentFrameSequence.value] || [];
      // mosaicStore의 현재 프레임 데이터를 원본으로 덮어쓰기
      mosaicStore.pushMosaicArray(currentFrameSequence.value, originalForCurrent);
      setMosaicRects(originalForCurrent);
    };


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
      resetAllMosaics,
      resetCurrentMosaics,
    };
  },
});
</script>

<template>
  <div>
    <h3>비디오 상세 정보</h3>
    <p v-if="video"><strong>작업명:</strong> {{ video.workTitle }}</p>
    <p v-if="video"><strong>비디오 파일명:</strong> {{ video.videoTitle }}</p>
    <div class="btn-container">
      <div class="refresh-btn-container">
        <button @click="resetAllMosaics()">모든 프레임 변경사항 초기화</button>
        <button @click="resetCurrentMosaics()">현재 프레임 변경사항 초기화</button>
      </div>
      <button @click="onEditingComplete">완료</button>
    </div>
    <div class="video-container" ref="videoContainer">
      <button class="frame-btn" @click="moveFrameWithMosaic('PREVIOUS')" :disabled="currentFrameSequence === 1">◀️
      </button>
      <div class="frame-container" style="position: relative;">
        <video ref="videoElement" crossorigin="anonymous" :src="videoSrc" style="width: 100%; height: auto"/>
        <canvas ref="canvasElement"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto;"
        />
      </div>
      <button class="frame-btn" @click="moveFrameWithMosaic('NEXT')"
              :disabled="currentFrameSequence === totalFrameCount - 1">▶️
      </button>
    </div>
    <VideoTimeline :timelineFrames="timelineFrames" @frameSelected="onFrameSelected"/>
  </div>
</template>

<style scoped>
.frame-btn {
  font-size: 30px;
}

.refresh-btn-container {
  display: flex;
  gap: 5px;

}

.btn-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 20px;
}
</style>
