<template>
  <div class="timeline" ref="timelineContainer">
    <div class="thumbnail-container">
      <div class="thumbnail" v-for="(frame, index) in timelineFrames" :key="index">
        <img
          draggable="false"
          :src="`${baseUrl}/${frame.object_name}`"
          alt="Thumbnail"
          @click="onThumbnailClick(frame.sequence, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import type { TimelineMetadata } from '@/types/video';

export default defineComponent({
  name: 'VideoTimeline',
  props: {
    timelineFrames: {
      type: Array as () => TimelineMetadata[],
      required: true,
    },
    baseUrl: {
      type: String,
      default: 'http://localhost:9000/di-bucket',
    },
  },
  emits: ['frameSelected'],
  setup(props, { emit }) {
    const timelineContainer = ref<HTMLElement | null>(null);

    // 드래그 관련 변수들
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let momentumID: number | null = null;

    // 드래그와 클릭을 구분하기 위한 flag 및 임계값
    let isDragging = false;
    const dragThreshold = 5; // 픽셀 단위 (필요에 따라 조정)

    // mousedown: 드래그 시작 시점
    const mouseDownHandler = (e: MouseEvent) => {
      if (!timelineContainer.value) return;
      isDown = true;
      isDragging = false; // 새로운 클릭/드래그 시작 시에는 false로 초기화
      timelineContainer.value.classList.add('active');
      startX = e.pageX - timelineContainer.value.offsetLeft;
      scrollLeft = timelineContainer.value.scrollLeft;
      lastX = e.pageX;
      lastTime = Date.now();
      if (momentumID) {
        cancelAnimationFrame(momentumID);
        momentumID = null;
      }
    };

    // mousemove: 드래그 중, 이동 거리가 임계값보다 크면 드래그로 판단
    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isDown || !timelineContainer.value) return;
      const x = e.pageX - timelineContainer.value.offsetLeft;
      const walk = x - startX;
      if (Math.abs(walk) > dragThreshold) {
        isDragging = true;
      }
      timelineContainer.value.scrollLeft = scrollLeft - walk;

      const now = Date.now();
      const deltaTime = now - lastTime;
      if (deltaTime > 0) {
        velocity = (e.pageX - lastX) / deltaTime;
        lastX = e.pageX;
        lastTime = now;
      }
    };

    // mouseup: 드래그 종료 및 관성 스크롤 시작
    const mouseUpHandler = () => {
      if (!isDown || !timelineContainer.value) return;
      isDown = false;
      timelineContainer.value.classList.remove('active');
      startMomentum();
    };

    // mouseleave: 영역을 벗어나도 종료
    const mouseLeaveHandler = () => {
      if (isDown) {
        mouseUpHandler();
      }
    };

    // 관성 스크롤 구현
    const startMomentum = () => {
      if (!timelineContainer.value) return;
      velocity *= 0.95; // 감쇠 계수
      timelineContainer.value.scrollLeft -= velocity * 20; // 스크롤 이동 배수 (조정 가능)
      if (Math.abs(velocity) > 0.1) {
        momentumID = requestAnimationFrame(startMomentum);
      } else {
        velocity = 0;
        momentumID = null;
      }
    };

    // 썸네일 클릭 시 호출되는 핸들러
    const onThumbnailClick = (sequence: number, event: MouseEvent) => {
      // 드래그가 발생한 경우, 클릭 이벤트를 무시
      if (isDragging) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      // 드래그가 아니라면, 클릭 이벤트로 프레임 이동 처리
      emit('frameSelected', sequence);
    };

    onMounted(() => {
      if (timelineContainer.value) {
        timelineContainer.value.addEventListener('mousedown', mouseDownHandler);
        timelineContainer.value.addEventListener('mousemove', mouseMoveHandler);
        timelineContainer.value.addEventListener('mouseup', mouseUpHandler);
        timelineContainer.value.addEventListener('mouseleave', mouseLeaveHandler);
      }
    });

    onBeforeUnmount(() => {
      if (timelineContainer.value) {
        timelineContainer.value.removeEventListener('mousedown', mouseDownHandler);
        timelineContainer.value.removeEventListener('mousemove', mouseMoveHandler);
        timelineContainer.value.removeEventListener('mouseup', mouseUpHandler);
        timelineContainer.value.removeEventListener('mouseleave', mouseLeaveHandler);
      }
      if (momentumID) {
        cancelAnimationFrame(momentumID);
      }
    });

    return { timelineContainer, onThumbnailClick };
  },
});
</script>
<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}

.thumbnail-container {
  display: flex;
  flex-direction: row;
}

.thumbnail {
  display: flex;
  flex-direction: column;
}

.thumbnail img {
  width: 100px;
  height: auto;
  margin-right: 5px;
}

/* 전체 스크롤바 스타일 */
::-webkit-scrollbar {
  height: 8px;
}

/* 스크롤바 트랙 (배경) */
::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
}

/* 스크롤바 핸들 (움직이는 부분) */
::-webkit-scrollbar-thumb {
  background: #3498db;
  border-radius: 10px;
}

/* 스크롤바 핸들에 마우스를 올렸을 때 */
::-webkit-scrollbar-thumb:hover {
  background: #2980b9;
}

.timeline {
  overflow-x: scroll; /* 수평 스크롤 활성화 */
  cursor: grab;
  user-select: none;  /* 텍스트 선택 방지 */
  -webkit-overflow-scrolling: touch; /* 모바일에서 네이티브 관성 스크롤 활성화 */
}

.timeline.active {
  cursor: grabbing;
}

.thumbnail-container {
  display: flex;
}

.thumbnail {
  flex: none;
  margin-right: 5px;
}
</style>
