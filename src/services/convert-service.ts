import api from './api';

interface ConvertVideoRequest {
  url: string;
  operation : String;
  requestId: String;
}

interface ConvertResponse {
  status: String;
  requestId: String; // 요청 ID
  VideoOutputPath: String; // 처리 결과 경로
  FrameOutputPath: String; // 처리 결과 경로
  // id: number;
  // authorId: number;
  // title: string;
  // content: string;
  // createTime: Date;
  // updateTime: Date;
}

// 영상 변환 요청 및 응답 [url(경로) to Frame(Video)]
export const convertVideo = async (request: ConvertVideoRequest): Promise<ConvertResponse> => {
  const response = await api.post<ConvertResponse>('/api/di', request);
  return response.data;
};

