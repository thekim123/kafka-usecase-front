import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface StompServiceInterface {
  connect(headers?: Record<string, string>): void;

  disconnect(): void;

  subscribe(destination: string, callback: (message: any) => void): void;

  send(destination: string, body: any, headers?: Record<string, string>): void;
}

export default class StompService implements StompServiceInterface {
  private client: Client;
  private userId: string;

  constructor(private url: string, userId: string) {
    this.userId = userId;
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.url),
      reconnectDelay: 5000,
      debug: (str) => console.log(`[Stomp Debug] ${str}`), // 디버그 메시지
    });
  }

  connect(headers: Record<string, string> = {}) {
    this.client.connectHeaders = headers;
    this.client.activate();
  }

  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
  }

  subscribe(destination: string, callback: (message: any) => void) {
    this.client.subscribe(destination, (message) => {
      try {
        callback(message);
      } catch (error) {
        console.error('failed to parse message body: ', message.body)
      }
    });
  }

  send(destination: string, body: any, headers: Record<string, string> = {}) {
    this.client.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
  }

}
