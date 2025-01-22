<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>새로운 작업 등록</h2>
      <section class="modal-input-form">
        <input id="video-title" v-model="workTitle" placeholder="작업 이름">
        <input id="video-file" v-on:change="changeVideo" placeholder="작업 이름" type="file">
      </section>
      <section>
        <button @click="registerVideo">등록</button>
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
      videoFile: null, // 파일을 저장할 변수
    };
  },
  setup() {

  },
  methods: {
    closeModal() {
      this.$emit("close"); // 부모 컴포넌트에 이벤트 전달
    },
    async registerVideo() {
      try {
        const request: VideoRegisterRequest = {workTitle: this.workTitle, file: this.videoFile};
        await VideoService.registerVideo(request);
        this.closeModal();
        this.$emit("video-registered"); // 부모로 이벤트 전달
      } catch (error) {
        console.log(error);
        alert("Failed to register video.");
      }
    },
    changeVideo(event) {
      // 파일 선택 시 파일 정보 저장
      this.videoFile = event.target.files[0];
      console.log("Selected File:", this.videoFile);
    },
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
