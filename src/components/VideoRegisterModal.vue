<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>새로운 작업 등록</h2>
      <section class="modal-input-form">
        <input id="video-title" v-model="workTitle" placeholder="작업 이름">
        <input id="video-file" v-on:change="changeVideo" type="file">
        <input id="image-files" v-on:change="changeImage" type="file" multiple>

        <div v-if="videoSrc" class="video-container">
          <video ref="videoPlayer" controls :src="videoSrc"></video>
        </div>

        <div class="image-preview-container">
          <img v-for="(imageSrc, index) in imagePreviews" :key="index" :src="imageSrc" class="preview-image">
        </div>

      </section>
      <section>
        <button @click="registerVideo" :disabled="isSubmitting">
          {{ isSubmitting ? "등록 중..." : "등록" }}</button>
        <button @click="closeModal">Close</button>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import {VideoService} from "@/services/video-service.js";
import {VideoRegisterRequest} from "@/types/video.js";

export default {
  name: "VideoRegisterModal",
  data() {
    return {
      workTitle: "", // 제목을 저장할 변수
      videoFile: null as File | null, // 파일을 저장할 변수
      targetImage: [] as File[], // 비식별 대상 이미지들을 저장할 배열
      imagePreviews: [] as string[], // 이미지 미리보기 배열
      videoSrc: '',
      isSubmitting: false, // 연속 등록 방지 플래그
    };
  },
  setup() {

  },
  methods: {
    closeModal() {
      this.$emit("close"); // 부모 컴포넌트에 이벤트 전달
    },
    registerVideo: async function () {
      if (this.isSubmitting) return; // 이미 요청 중이면 다시 실행 X
      if (!this.videoFile) {
        alert('비디오 파일을 등록해주세요.');
        return;
      }

      // if (this.targetImages.length === 0) {
      //   alert("최소 한 장 이상의 이미지를 등록해주세요.");
      //   return;
      // }

      try {
        this.isSubmitting = true; // 요청 시작 시 플래그 활성화

        const request: VideoRegisterRequest = {
          workTitle: this.workTitle,
          file: this.videoFile,
          images: this.targetImage,
        };

        await VideoService.registerVideo(request);
        this.closeModal();
        this.$emit("video-registered"); // 부모로 이벤트 전달
      } catch (error) {
        console.log(error);
        alert("Failed to register video.");
      } finally {
        this.isSubmitting = false; // 요청 완료 후 플래그 해제
      }
    },
    changeVideo(event: Event) {
      const inputElement = event.target as HTMLInputElement;

      if (!inputElement.files || inputElement.files.length === 0) {
        console.error("No file selected.");
        return;
      }

      const selectedFile = inputElement.files[0];

      if (selectedFile) {
        this.videoFile = selectedFile; // ✅ 정상적인 File 객체만 저장
        this.videoSrc = URL.createObjectURL(this.videoFile);
      }

      console.log("Selected File:", this.videoFile);
    },
    changeImage(event: Event) {
      const inputElement = event.target as HTMLInputElement;

      if (!inputElement.files || inputElement.files.length === 0) {
        console.error("No files selected.");
        return;
      }

      // FileList를 배열로 변환
      this.targetImage = Array.from(inputElement.files);

      // 이미지 미리보기 생성
      this.imagePreviews = this.targetImage.map(file => URL.createObjectURL(file));

      console.log("Selected Images:", this.targetImage);
    }
  },
};
</script>

<style>
/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 90%; /* 화면 크기에 따라 동적으로 조정 */
  max-height: 90%; /* 최대 높이 설정 */
  overflow: auto; /* 내부 스크롤 추가 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-container {
  max-width: 100%; /* 부모 요소 크기에 따라 조정 */
  max-height: auto; /* 모달 높이에 맞춤 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 넘치는 내용 숨김 */
}

video {
  max-width: 100%; /* 비디오가 모달 크기를 넘지 않도록 제한 */
  height: auto; /* 비율 유지 */
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
}

.modal-input-form {
  display: flex;
  flex-direction: column;
}
</style>
