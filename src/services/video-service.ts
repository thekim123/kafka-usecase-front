import api from './api'
import {Page} from '@/types/page'
import {VideoResponse} from "@/types/video";
import {PageUtil} from '@/util/page-util'

export const VideoService = {
  async fetchVideoList(page: Page): Promise<VideoResponse> {
    const url = PageUtil.toQueryString(page, '/api/video/list');
    const response = await api.get<VideoResponse>(url);
    return response.data;
  }
}
