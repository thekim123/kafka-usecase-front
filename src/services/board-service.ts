import api from './api';

interface BoardPostRequest {
  authorId: number;
  title: string;
  content: string;
}

interface BoardResponse {
  id: number;
  authorId: number;
  title: string;
  content: string;
  createTime: Date;
  updateTime: Date;
}

// 게시글 작성
export const postBoard = async (request: BoardPostRequest): Promise<BoardResponse> => {
  const response = await api.post<BoardResponse>('/api/board', request);
  return response.data;
};

// 게시글 조회
export const getBoard = async (id: number): Promise<BoardResponse> => {
  const response = await api.get<BoardResponse>(`/api/board/${id}`);
  return response.data;
};
