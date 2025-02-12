import {PersonRect, PythonRectData, Rect, SequenceItem} from "@/types/rect";

export function transformSequenceData(data: PythonRectData): Array<{ frameSequence: number; rects: Rect[] }> {
  return data.sequence.map((item: SequenceItem) => {
    const rects: Rect[] = item.person.map((p: PersonRect) => ({
      x: p.x1,
      y: p.y1,
      width: p.x2 - p.x1,
      height: p.y2 - p.y1,
    }));
    return {
      frameSequence: item.seq,
      rects,
    }
  });
}

export function convertMosaicsToPythonFormat(
  mosaics: Record<number, Rect[]>,
  totalFrames: number,
  fps: number,
): PythonRectData {
  const sequence: SequenceItem[] = Object.keys(mosaics).map(frameKey => {
    const frameSeq = Number(frameKey);
    const person: PersonRect[] = mosaics[frameSeq].map(rect => ({
      x1: rect.x,
      y1: rect.y,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
    }));
    return {seq: frameSeq, person};
  });
  return {
    sequence,
    total_frames: totalFrames,
    fps,
  }
}
