import {defineStore} from "pinia";
import {ref} from 'vue';
import {Video} from "@/types/video";
import {Page} from "@/types/page";
import {PageUtil} from "@/util/page-util";
import {VideoService} from "@/services/video-service";

export const useVideoStore
  = defineStore('video', () => {
  const currentVideoId = ref<string | null>(null);
  const timelineThumbnails = ref<any[]>([]);
  const currentTime = ref(0);
  const duration = ref(0);

  const videoList = ref<Video[]>([]);
  const page: Page = PageUtil.createDefaultPage();

  const loadVideos = async (p: Page) => {
    try {
      const list = await VideoService.fetchVideoList(p);
      videoList.value = list.content;
    } catch (error) {
      console.error('Failed to fetch video list', error);
    }
  };

  const setDuration = (videoDuration: number) => {
    duration.value = videoDuration;
  };

  const setTimeline = (videoId: string, thumbnails: any[]) => {
    currentVideoId.value = videoId;
    timelineThumbnails.value = thumbnails;
  };

  const updateCurrentTime = (time: number) => {
    currentTime.value = time;
  };

  const getVideoById = (videoId: string) => {
    if (Array.isArray(videoList.value)) {
      return (videoList.value).find((video: Video) => video.videoId === videoId) || null;
    }
  };

  return {
    videoList,
    loadVideos,
    getVideoById,
    currentTime,
    currentVideoId,
    setTimeline,
    updateCurrentTime,
    setDuration,
  }

});
