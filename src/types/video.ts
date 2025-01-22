import {User} from "@/types/user";
import {OriginalFrame} from "@/types/frame";
import {AttachFile} from "@/types/attach-file";

export interface Video {
  videoId: string;
  videoTitle: string;
  videoFileId: number;
  ownerId: number;
  workTitle: string;
}

export interface VideoResponse {
  content: Video[];
  total: number;    // 총 데이터 수
  page: number;     // 현재 페이지
  size: number;     // 페이지 크기
  sort: string;     // 정렬 기준
}

export interface VideoRegisterRequest {
  workTitle: string;
  file: File;
}

export interface VideoRegisterResponse {

}

export interface VideoDetail {
  videoId: string;
  videoTitle: string;
  workTitle: string;
  owner: User;
  frameInfo: OriginalFrame;
  videoInfo: AttachFile;
}

