<script lang="ts">
import {defineComponent, onMounted, onUnmounted, PropType} from "vue";
import {Video} from "@/types/video";
import {useRoute} from "vue-router";
import {Client} from "@stomp/stompjs";
import {useStompStore} from "@/stores/stomp";

export default defineComponent({
  name: "VideoDetail",
  setup() {
    const route = useRoute();
    const videoId = route.params.videoId;

    const stompStore = useStompStore();
    const stompClient = stompStore.getClient();

    onMounted(() => {

      if (stompClient) {
        stompClient.subscribe(`/topic/frames/${videoId}`, (message) => {
          showImage(message);
        });
      }
      sendMessage(1, 10);
    });

    const sendMessage = (start: number, end: number) => {
      if (stompClient) {
        const frameParam = {start: start, end: end};
        stompClient.send(`/app/frames/request/${videoId}`, frameParam, {});
      }
    }

    const showImage = (base64Data: string) => {
      try {
        const img = document.getElementById('canvas') as HTMLImageElement;
        if (!img) {
          console.error('Image element with id "canvas" not found');
          return;
        }

        const sanitizedData = sanitizeBase64(base64Data);

        // Base64 디코딩 후 Blob URL 생성
        const byteCharacters = atob(sanitizedData); // Base64 디코딩
        const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0)); // Uint8Array로 변환
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        // Blob URL을 img src로 설정
        img.src = URL.createObjectURL(blob);

        // 디버깅 로그
        console.log('Image displayed successfully');
      } catch (error) {
        console.error('Error displaying image:', error);
      }
    }

    const sanitizeBase64 = (data: string): string => {
      // Base64 URL-safe 변환
      let sanitized = data.replace(/-/g, '+').replace(/_/g, '/');

      // 문자열 길이를 4의 배수로 패딩
      while (sanitized.length % 4 !== 0) {
        sanitized += '=';
      }

      return sanitized;
    };

    return {videoId}
  }
});
</script>

<template>
  <div>
    <h3>비디오 상세 정보</h3>
    <p><strong>ID:</strong> {{ videoId }}</p>
    <img id="canvas" src="" alt="">

  </div>
</template>

<style scoped>

</style>
