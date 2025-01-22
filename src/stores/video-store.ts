import {defineStore} from "pinia";
import {ref} from 'vue';
import {Video} from "@/types/video";
import {Page} from "@/types/page";
import {PageUtil} from "@/util/page-util";
import {VideoService} from "@/services/video-service";

export const useVideoStore = defineStore('video', () => {
  const videoList = ref<Video>([]);
  const page: Page = PageUtil.createDefaultPage();

  const loadVideos = async () => {
    try {
      const list = await VideoService.fetchVideoList(page);
      videoList.value = list.content;
    } catch (error) {
      console.error('Failed to fetch video list', error);
    }
  };

  const getVideoById = (videoId: string) => {
    const video = videoList.value.find((video) => video.videoId === videoId) || null;
    console.log('video: ' + JSON.stringify(video.videoId));
    return videoList.value.find((video) => video.videoId === videoId) || null;
  };

  return {
    videoList,
    loadVideos,
    getVideoById,
  }

});
