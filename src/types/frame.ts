export interface Frame {
  sequence: number;
  blob: Blob;
}

export interface OriginalFrame {
  id: number;
  startSequence: number;
  endSequence: number;
}

export class FrameImpl implements Frame {
  sequence: number;
  blob: Blob;

  constructor(sequence: number, blob: Blob) {
    this.sequence = sequence;
    this.blob = blob;
  }

  async toBase64(): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(this.blob);
    });
  }
}

//
// // 사용 예시
// const frameBlob = new Blob(["frame data"], {type: "image/jpeg"});
// const frame = new FrameImpl(1, frameBlob);
//
// frame.toBase64().then((base64) => console.log(base64));
