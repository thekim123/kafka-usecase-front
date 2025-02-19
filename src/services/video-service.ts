import api from '@/services/api'
import {Page} from '@/types/page'
import {TimelineMetadata, VideoDetail, VideoRegisterRequest, VideoRegisterResponse, VideoResponse} from "@/types/video";
import {AttachFile} from "@/types/attach-file";
import {PageUtil} from '@/util/page-util'
import axios from "axios";
import {PythonRectData, Rect, SequenceItem} from "@/types/rect";
import {convertMosaicsToPythonFormat, transformSequenceData} from "@/util/transform-sequence-data";

export const VideoService = {
  async fetchVideoList(page: Page): Promise<VideoResponse> {
    const url = PageUtil.toQueryString(page, '/api/video/list');
    const response = await api.get<VideoResponse>(url);
    return response.data;
  },

  async fetchVideoDetail(videoId: string): Promise<VideoDetail> {
    const url = '/api/video/detail/' + videoId;
    const response = await api.get<VideoDetail>(url);
    return response.data;
  },

  async registerVideo(request: VideoRegisterRequest): Promise<VideoRegisterResponse> {
    const url = '/api/video';
    const formData = new FormData();
    formData.append("workTitle", request.workTitle);
    formData.append("file", request.file);

    // 여러 이미지 파일 추가
    request.images.forEach((image, index) => {
      formData.append("images", image);
    });

    const headers = {
      headers: {
        "Content-Type": "multipart/form-data", // 멀티파트 요청 설정
      },
    };
    const response = await api.post<VideoRegisterRequest>(url, formData, headers);
    return response.data;
  },


  async fetchTimelineMetadata(videoId: string): Promise<TimelineMetadata[]> {
    const url = import.meta.env.VITE_STORAGE + `/${videoId}/timeline/timeline.json`;
    const response = await axios.get<TimelineMetadata[]>(url);
    return response.data;
  },

  async fetchPythonRects(videoId: string) {
    const response = await axios.get<PythonRectData>(import.meta.env.VITE_STORAGE + `/${videoId}/metadata.json`);
    return response;
  },

  async saveAllMosaics(videoId: string, mosaic: Record<number, Rect[]>, totalFrames: number, fps: number) {
    console.log(`mosaics: ${mosaic}, totalFrames: ${totalFrames}, fps: ${fps}`);
    const payload: SequenceItem[] = convertMosaicsToPythonFormat(mosaic);
    console.log(payload);
    await api.post(`/api/video/finalize/${videoId}`, payload);
  },

  async fetchFinalVideo(videoId: string): Promise<AttachFile> {
    const url = '/api/video/final/' + videoId;
    const response = await api.get<AttachFile>(url);
    return response.data;
  },

}
