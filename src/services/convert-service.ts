import api from './api';

interface ConvertVideoRequest {
  url: string;
  operation: string; // 작업 유형 (split, merge)
  requestId: string; // 요청 ID
}

interface ConvertResponse {
  status: string; // 상태
  requestId: string; // 요청 ID
  outputPath: string; // 전체 출력 경로
  firstFrameUrl: string; // 첫 번째 프레임 URL
  lastFrameUrl: string; // 마지막 프레임 URL
  videoUrl?: string; // 결과 비디오 URL (선택적)
  operation: string; // 작업 유형
  message: string; // 결과 메시지
}

// 영상 변환 요청 및 응답 [url(경로) to Frame(Video)]
export const convertVideo = async (request: ConvertVideoRequest): Promise<ConvertResponse> => {
  const response = await api.post<ConvertResponse>('/api/di', request);
  return response.data;
};
