import {defineStore} from "pinia";
import {Rect} from "@/types/rect";
import {VideoService} from "@/services/video-service";
import {transformSequenceData} from "@/util/transform-sequence-data";

export const useMosaicStore = defineStore('mosaicStore', {
  state: () => ({
    mosaics: {} as Record<number, Rect[]>,
    total_frames: 0,
    fps: 0,
  }),
  actions: {
    async loadRects() {
      const fetchedRects
        = await VideoService.fetchPythonRects('asdfg');

      this.total_frames = fetchedRects.data.total_frames;
      this.fps = fetchedRects.data.fps;

      const record: Record<number, Rect[]> = {};
      const transformedRects = transformSequenceData(fetchedRects.data);

      transformedRects.forEach(item => {
        record[item.frameSequence] = item.rects;
      });
      this.mosaics = record;
      console.log(`this mosaic: ${JSON.stringify(this.mosaics)}`);
    },
    pushMosaicArray(frameSequence: number, rects: Rect[]) {
      this.mosaics[frameSequence] = rects;
    },
    pushMosaic(frameSequence: number, rect: Rect) {
      this.mosaics[frameSequence].push(rect);
    },
    getMosaics(frameSequence: number): Rect[] {
      console.log(`get mosaics is called: ${this.mosaics[frameSequence] || []}`)
      return this.mosaics[frameSequence] || [];
    },
    removeMosaic(frameSequence: number, index: number) {
      if (this.mosaics[frameSequence]) {
        this.mosaics[frameSequence].splice(index, 1);
      }
    },
    removeAllMosaics(frameSequence: number) {
      delete this.mosaics[frameSequence];
    },
    async saveAllMosaics() {
      try {
        await VideoService.saveAllMosaics(this.mosaics, this.total_frames, this.fps);
      } catch (e) {
        console.log(`save all mosaics is failed: ${e}`);
      }
    },
  },
});
