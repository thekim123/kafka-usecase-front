export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PersonRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface SequenceItem {
  seq: number;
  person: PersonRect[];
}

export interface PythonRectData {
  sequence: SequenceItem[];
  total_frames: number;
  fps: number;
}

