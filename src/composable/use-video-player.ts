// src/composables/useVideoPlayer.ts
import { ref, nextTick } from "vue";

export function useVideoPlayer(fps: number) {
  const videoElement = ref<HTMLVideoElement | null>(null);
  const canvasElement = ref<HTMLCanvasElement | null>(null);
  const currentFrameSequence = ref(0);

  const captureFrame = async (frameIndex: number) => {
    await nextTick();
    return new Promise<void>((resolve, reject) => {
      const video = videoElement.value;
      const canvas = canvasElement.value;
      if (!video || !canvas) return reject("비디오 또는 캔버스 요소가 없습니다.");

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas Context is null");

      // 프레임 위치 설정
      video.currentTime = frameIndex / fps;
      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve();
      };
      video.onerror = (err) => reject(err);
    });
  };

  const changeFrame = async (frameSequence: number) => {
    currentFrameSequence.value = frameSequence;
    await captureFrame(frameSequence);
  };

  const prevFrame = async () => {
    if (currentFrameSequence.value > 0) {
      await changeFrame(currentFrameSequence.value - 1);
    }
  };

  const nextFrame = async (totalFrameCount: number) => {
    if (currentFrameSequence.value < totalFrameCount - 1) {
      await changeFrame(currentFrameSequence.value + 1);
    }
  };

  return {
    videoElement,
    canvasElement,
    currentFrameSequence,
    captureFrame,
    changeFrame,
    prevFrame,
    nextFrame,
  };
}
