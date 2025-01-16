export interface Video{
  videoId: string;
  videoTitle: string;
  videoFileId: number;
  ownerId: number;
}

export interface VideoResponse {
  content: Video[];
  total: number;    // 총 데이터 수
  page: number;     // 현재 페이지
  size: number;     // 페이지 크기
  sort: string;     // 정렬 기준
}


