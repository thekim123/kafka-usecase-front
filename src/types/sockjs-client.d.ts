declare module "sockjs-client" {
  export default class SockJS {
    constructor(url: string, _reserved?: any, options?: any);
    onopen: () => void;
    onmessage: (e: { data: string }) => void;
    onclose: () => void;
    close: () => void;
    send: (data: string) => void;
  }
}
