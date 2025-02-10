import api from '@/services/api'
import {Page} from '@/types/page'
import {TimelineMetadata, VideoDetail, VideoRegisterRequest, VideoRegisterResponse, VideoResponse} from "@/types/video";
import {PageUtil} from '@/util/page-util'
import axios from "axios";

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
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data", // 멀티파트 요청 설정
      },
    };
    const response = await api.post<VideoRegisterRequest>(url, formData, headers);
    return response.data;
  },


  async fetchTimelineMetadata(videoId: string):Promise<TimelineMetadata[]> {
    const bucketUrl = `http://localhost:9000/di-bucket`;
    const url = bucketUrl + `/${videoId}/timeline/timeline.json`;
    const response = await axios.get<TimelineMetadata[]>(url);
    return response.data;
  },

}
