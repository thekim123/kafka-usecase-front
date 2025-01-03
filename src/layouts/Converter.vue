<template>
  <div class="converter">
    <h1>🎞 비식별 처리</h1>

    <!-- 게시글 작성 폼 -->
    <div class="converter">
      <form @submit.prevent="summitConvert">
        <h2>✍️ URL</h2>
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
        <li><strong>outputPath</strong>
          <a :href="`${convertedUrl.frameOutputPath}`" target="_blank">
            {{ `${convertedUrl.frameOutputPath}` }}
          </a>
        </li>
        <hr/>
        <li><strong>영상 URL:</strong>
          <a :href="`${convertedUrl.frameOutputPath}.mp4`" target="_blank">
            {{ `${convertedUrl.frameOutputPath}.mp4` }}
          </a>
        </li>
        <li><strong>프레임 URL:</strong>
          <a :href="`file://${convertedUrl.frameOutputPath}`" target="_blank">
            {{ `file://${convertedUrl.frameOutputPath}` }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>


<script lang="ts">
import {defineComponent, reactive, ref} from 'vue';
import {convertVideo} from '@/services/convert-service'; // API 경로는 실제 사용 환경에 맞게 조정
import api from '@/services/api'; // 공통 API 파일

interface ConvertVideoRequest {
  url: string;
  operation: String;
  requestId: String;
}

interface ConvertResponse {
  status: String;
  requestId: String; // 요청 ID
  videoOutputPath: String; // 처리 결과 경로
  frameOutputPath: String; // 처리 결과 경로
}

export default defineComponent({
  name: 'Converter',
  setup() {
    const convertRequest = reactive<ConvertVideoRequest>({
      url: '',
      operation: '',
      requestId: '',
    });

    const isLoading = ref(false); // 로딩 상태
    const convertedUrl = ref<ConvertResponse | null>(null); // 응답 데이터 저장


    const summitConvert = async () => {
      isLoading.value = true; // 스피너 표시
      try {
        const response = await convertVideo(convertRequest);
        convertedUrl.value = response;  // 응답 데이터 저장
        isLoading.value = false;
        console.log('Created url:', response);
        alert('처리가 완료 되었습니다..')
      } catch (error) {
        isLoading.value = false; // 스피너 숨김
        console.error('처리 실패' + error);
        alert('처리에 실패했습니다.')
      }
    };

    return {
      convertRequest,
      summitConvert,
      isLoading,
      convertedUrl,
    }
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
