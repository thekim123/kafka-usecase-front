import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";


export default class StompService {
  private client: Client;

  constructor(private url: string) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.url),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
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
      callback(JSON.parse(message.body));
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
