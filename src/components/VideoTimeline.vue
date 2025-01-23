<script lang="ts">
import {useVideoStore} from "@/stores/video-store";

export default {
  name: 'VideoTimeline',
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      frameInterval: 10,
      currentPosition: 0,
    };
  },
  setup(props) {
    const videoStore = useVideoStore();
    const videoId = props.videoId;
    const video = videoStore.getVideoById(videoId);
    const frames: Blob[] = [];

    return {video, frames};
  },
  methods: {
    goToFrame(index: number) {
      const time = index * this.frameInterval; // 프레임 간격 계산
      this.$emit('seek', time); // 부모 컴포넌트로 이동 시간 전달
    },
  },
};
</script>

<template>
  <div class="timeline">
    <div class="thumbnail" v-for="(frame, index) in frames" :key="index" @click="goToFrame(index)">
      <!--      <img :src="frame" alt="Thumbnail"/>-->
    </div>
    <div class="progress-bar">
      <div class="current-position" :style="{ left: currentPosition + '%' }"></div>
    </div>
  </div>
</template>


<style scoped>
.timeline {
  display: flex;
  overflow-x: auto;
}

.thumbnail img {
  width: 100px;
  height: auto;
  margin-right: 5px;
}

.progress-bar {
  position: relative;
  height: 4px;
  background: #ccc;
  width: 100%;
  margin-top: 10px;
}

.current-position {
  position: absolute;
  height: 100%;
  width: 2px;
  background: #ff0000;
}
</style>
