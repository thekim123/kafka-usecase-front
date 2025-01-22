import {defineStore} from "pinia";
import StompService, {StompServiceInterface} from "@/services/socket-service";

export const useStompStore = defineStore('stomp', {
  state: () => ({
    stompClient: null as StompService | null,
  }),

  actions: {
    createClient(userId: string, url: string) {
      this.stompClient = new StompService(url, userId);
      // TODO: connect 시에 인증 추가
      this.stompClient.connect();
    },

    disconnectClient() {
      if (this.stompClient) {
        this.stompClient.disconnect();
        this.stompClient = null;
      }
    },

    getClient(): StompServiceInterface | null {
      return this.stompClient;
    },

  }
})
