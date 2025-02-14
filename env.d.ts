/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_SERVER: string;
  readonly VITE_STORAGE: string;
  // 다른 환경 변수들을 여기에 추가할 수 있습니다.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
