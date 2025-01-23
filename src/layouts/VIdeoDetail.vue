<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {useRoute} from "vue-router";
import {useStompStore} from "@/stores/stomp-store";
import {Deque} from '@/types/deque'
import {Frame, FrameImpl} from "@/types/frame";
import {throttle} from "lodash";
import {VideoService} from "@/services/video-service";
import VideoTimeline from "@/components/VideoTimeline.vue"

export default defineComponent({
  name: "VideoDetail",
  components: {VideoTimeline},
  data() {
    return {
      startSequence: 0,
      endSequence: 1,
    }
  },
  setup() {
    const route = useRoute();
    const videoId = route.params.videoId;
    const video = VideoService.fetchVideoDetail(videoId);

    const stompStore = useStompStore();
    const stompClient = stompStore.getClient();
    const imageDeque = new Deque<Frame>(30);

    onMounted(() => {
      if (stompClient) {
        stompClient.subscribe(`/topic/frames/${videoId}`, (message) => {
          loadImageOnDeque(message);
          // Blob URL을 img src로 설정
          updateImage();
        });
      }
      throttledSendMessage(1, 50, "BACK")
    });

    // onUnmounted(() => {
    //   if (subscription) {
    //     subscription.unsubscribe(); // 구독 해제
    //     console.log("Unsubscribed from STOMP topic.");
    //   }
    // });

    const sendMessage = (start: number, end: number, direction: string) => {
      if (stompClient) {
        const frameParam = {start: start, end: end, direction: direction};
        stompClient.send(`/app/frames/request/${videoId}`, frameParam, {});
      }
    }

    const throttledSendMessage = throttle((start: number, end: number, direction: string) => {
      sendMessage(start, end, direction);
    }, 200); // 200ms 간격

    const loadImageOnDeque = (base64Data: string) => {
      try {
        const data = JSON.parse(base64Data.body);
        const sanitizedData = sanitizeBase64(base64Data);

        const byteCharacters = atob(sanitizedData);
        const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: "image/jpeg"});

        const frame = new FrameImpl(data.sequence, blob);

        // 중복 데이터 방지
        const existingFrame = imageDeque.getItems().find((f) => f.sequence === frame.sequence);
        if (!existingFrame) {
          if (data.direction === "FRONT") {
            imageDeque.addFront(frame);
          } else {
            imageDeque.addBack(frame);
          }
        }

        updateImage(); // 새 프레임 추가 후 이미지 업데이트
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    const sanitizeBase64 = (data: string): string => {
      // Base64 URL-safe 변환
      let sanitized = JSON.parse(data.body).base64Data.replace(/-/g, '+').replace(/_/g, '/');

      // 문자열 길이를 4의 배수로 패딩
      while (sanitized.length % 4 !== 0) {
        sanitized += '=';
      }

      return sanitized;
    };

    const moveLeft = () => {
      const frontSequence = imageDeque.peekFront()?.sequence;
      if (frontSequence !== undefined) {
        throttledSendMessage(frontSequence - 1, frontSequence - 1, "FRONT");
      }

      updateImage(); // 중앙 이미지 업데이트
    };

    const moveRight = () => {

      const backSequence = imageDeque.peekBack()?.sequence;
      if (backSequence !== undefined) {
        throttledSendMessage(backSequence + 1, backSequence + 1, "BACK");
      } else if (backSequence) {
      }

      updateImage(); // 중앙 이미지 업데이트
    };


    const updateImage = () => {
      const centerIndex = Math.floor(imageDeque.size() / 2); // 중앙 인덱스
      const centerFrame = imageDeque.getItems()[centerIndex];
      const img = document.getElementById("canvas") as HTMLImageElement;
      if (centerFrame && img) {
        img.src = URL.createObjectURL(centerFrame.blob);
      }
      currentSequence();
    };

    const currentSequence = () => {
      // console.log('size: ' + imageDeque.size() + ', curseq:' + imageDeque.getItems()[Math.floor(imageDeque.size() / 2)].sequence);
      // console.log('image deque: ' + JSON.stringify(imageDeque));
      return imageDeque.size() / 2;
    }

    return {videoId, moveLeft, moveRight, currentSequence, video}
  }
});
</script>

<template>
  <div>
    <h3>비디오 상세 정보</h3>
    <p><strong>작업명: </strong> {{ video.workTitle }}</p>
    <p><strong>비디오 파일명: </strong> {{ video.videoTitle }}</p>
    <div class="frame-container">
      <!-- 왼쪽 화살표 -->
      <button id="prevFrame" class="frame-control-btn-prev" @click="moveLeft">
        &#9664;
      </button>

      <!-- 이미지 -->
      <img id="canvas" class="image-box" src="" alt="">

      <!-- 오른쪽 화살표 -->
      <button id="nextFrame" class="frame-control-btn-next" @click="moveRight">
        &#9654;
      </button>
    </div>
    <VideoTimeline :videoId="videoId"/>
  </div>

</template>

<style scoped>
.image-box {
  max-width: 80%;
  height: auto;
}

.frame-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.frame-control-btn-next {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.frame-control-btn-prev {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}
</style>
