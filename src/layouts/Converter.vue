<template>
  <div class="converter">
    <h1>🎞 영상 처리</h1>

    <!-- 게시글 작성 폼 -->
    <div class="converter">
      <form @submit.prevent="submitConvert">
        <h2>✍️ URL</h2>
        <h2>
          https://www.youtube.com/watch?v=bOgjkO7keBQ
        </h2>
        <div>
          <label>URL:</label>
          <input v-model="convertRequest.url" type="text" required/>
        </div>
        <button type="submit">변환 요청</button>
      </form>
    </div>

    <!-- 스피너 표시 -->
    <div v-if="isLoading" class="spinner-container">
      <div class="spinner"></div>
      <p>잠시만 기다려 주세요...</p>
    </div>

    <!-- 처리 결과 표시 -->
    <div v-if="convertedUrl" class="result">
      <h3>처리 결과</h3>
      <ul>
        <li><strong>Output Path:</strong>
          <a :href="convertedUrl.outputPath" target="_blank">{{ convertedUrl.outputPath }}</a>
        </li>
        <li><strong>First Frame URL:</strong>
          <a :href="convertedUrl.firstFrameUrl" target="_blank">{{ convertedUrl.firstFrameUrl }}</a>
        </li>
        <li><strong>Last Frame URL:</strong>
          <a :href="convertedUrl.lastFrameUrl" target="_blank">{{ convertedUrl.lastFrameUrl }}</a>
        </li>
        <li v-if="convertedUrl.videoUrl"><strong>Video URL:</strong>
          <a :href="convertedUrl.videoUrl" target="_blank">{{ convertedUrl.videoUrl }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { convertVideo } from "@/services/convert-service";

interface ConvertVideoRequest {
  url: string;
  operation: string;
  requestId: string;
}

interface ConvertResponse {
  status: string; // 작업 상태
  requestId: string; // 요청 ID
  outputPath: string; // 처리 결과 경로
  firstFrameUrl: string; // 첫 번째 프레임 URL
  lastFrameUrl: string; // 마지막 프레임 URL
  videoUrl: string | null; // 결과 비디오 URL (null 허용)
  operation: string; // 작업 유형 (split, merge)
  message: string; // 메시지
}

function isConvertResponse(response: any): response is ConvertResponse {
  return (
    typeof response.status === "string" &&
    typeof response.requestId === "string" &&
    typeof response.outputPath === "string" &&
    typeof response.firstFrameUrl === "string" &&
    typeof response.lastFrameUrl === "string" &&
    (typeof response.videoUrl === "string" || response.videoUrl === null) && // 수정
    typeof response.operation === "string" &&
    typeof response.message === "string"
  );
}


export default defineComponent({
  name: "Converter",
  setup() {
    const convertRequest = reactive<ConvertVideoRequest>({
      url: "",
      operation: "split",
      requestId: "",
    });

    const isLoading = ref(false);
    const convertedUrl = ref<ConvertResponse | null>(null);

    const submitConvert = async () => {
      convertedUrl.value = null;
      isLoading.value = true;
      try {
        const response = await convertVideo(convertRequest);
        console.log("Raw response:", response); // 응답 확인
        if (isConvertResponse(response)) {
          convertedUrl.value = response;
        } else {
          console.error("Invalid response format:", response);
          throw new Error("Unexpected response structure");
        }
        alert("처리가 완료되었습니다.");
      } catch (error) {
        console.error("처리 실패:", error);
        alert("처리에 실패했습니다.");
      } finally {
        isLoading.value = false;
      }
    };


    return {
      convertRequest,
      submitConvert,
      isLoading,
      convertedUrl,
    };
  },
});
</script>


<style scoped>
/* 전체 컨버터 컨테이너 */
.converter {
  min-width: 600px;
  max-width: 100%;
  margin: 20px auto; /* 화면 중앙 정렬 */
  padding: 20px;
  background-color: #ffffff; /* 배경색을 흰색으로 설정 */
  border: 1px solid #e0e0e0; /* 부드러운 테두리 */
  border-radius: 10px; /* 모서리를 둥글게 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}

/* 헤더 스타일 */
h1 {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

/* 폼 스타일 */
form {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 입력 필드 간 간격 */
}

/* 라벨 및 입력 필드 */
label {
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s ease-in-out;
}

input:focus {
  border-color: #3498db; /* 포커스 시 파란색 강조 */
  outline: none;
}

/* 버튼 스타일 */
button {
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: #2c80bf; /* 호버 시 어두운 파란색 */
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 스피너 컨테이너 */
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.result {
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}

.result h3 {
  margin-bottom: 10px;
  color: #333;
}

.result ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result li {
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.result a {
  color: #3498db;
  text-decoration: none;
}

.result a:hover {
  text-decoration: underline;
}
</style>
