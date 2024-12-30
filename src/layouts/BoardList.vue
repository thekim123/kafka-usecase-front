<template>
  <div>
    <h1>📋 게시판</h1>

    <!-- 게시글 작성 폼 -->
    <form @submit.prevent="submitPost">
      <h2>✍️ 게시글 작성</h2>
      <div>
        <label>작성자 ID:</label>
        <input v-model.number="postRequest.authorId" type="number" required />
      </div>
      <div>
        <label>제목:</label>
        <input v-model="postRequest.title" type="text" required />
      </div>
      <div>
        <label>내용:</label>
        <textarea v-model="postRequest.content" required></textarea>
      </div>
      <button type="submit">게시글 작성</button>
    </form>

    <hr />

    <!-- 단일 게시글 조회 -->
    <div>
      <h2>🔍 단일 게시글 조회</h2>
      <label>게시글 ID로 조회:</label>
      <input v-model.number="searchId" type="number" placeholder="게시글 ID" />
      <button @click="fetchBoard">조회</button>
    </div>

    <div v-if="board">
      <h3>게시글 상세 정보</h3>
      <p><strong>ID:</strong> {{ board.id }}</p>
      <p><strong>작성자:</strong> {{ board.authorId }}</p>
      <p><strong>제목:</strong> {{ board.title }}</p>
      <p><strong>내용:</strong> {{ board.content }}</p>
      <p><strong>생성일:</strong> {{ board.createTime }}</p>
      <p><strong>수정일:</strong> {{ board.updateTime }}</p>
    </div>

    <hr />

    <!-- 게시글 리스트 조회 -->
    <div>
      <h2>📑 게시글 리스트</h2>
      <button @click="fetchBoardList">모든 게시글 조회</button>
    </div>

    <div v-if="boardList.length > 0">
      <h3>전체 게시글</h3>
      <ul>
        <li v-for="item in boardList" :key="item.id">
          <p><strong>ID:</strong> {{ item.id }}</p>
          <p><strong>작성자:</strong> {{ item.authorId }}</p>
          <p><strong>제목:</strong> {{ item.title }}</p>
          <p><strong>내용:</strong> {{ item.content }}</p>
          <p><strong>생성일:</strong> {{ item.createTime }}</p>
          <p><strong>수정일:</strong> {{ item.updateTime }}</p>
          <hr />
        </li>
      </ul>
    </div>
  </div>
</template>

---

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { postBoard, getBoard } from '@/services/board-service'; // API 경로는 실제 사용 환경에 맞게 조정
import api from '@/services/api'; // 공통 API 파일

interface BoardPostRequest {
  authorId: number;
  title: string;
  content: string;
}

interface BoardResponse {
  id: number;
  authorId: number;
  title: string;
  content: string;
  createTime: Date;
  updateTime: Date;
}

export default defineComponent({
  name: 'BoardList',
  setup() {
    // 게시글 작성 요청 객체
    const postRequest = reactive<BoardPostRequest>({
      authorId: 0,
      title: '',
      content: '',
    });

    // 단일 게시글
    const board = ref<BoardResponse | null>(null);

    // 게시글 리스트
    const boardList = ref<BoardResponse[]>([]);

    // 게시글 ID 조회
    const searchId = ref<number | null>(null);

    // 게시글 작성
    const submitPost = async () => {
      try {
        const response = await postBoard(postRequest);
        alert('게시글이 성공적으로 작성되었습니다.');
        console.log('Created Post:', response);

        // 초기화
        postRequest.authorId = 0;
        postRequest.title = '';
        postRequest.content = '';
      } catch (error) {
        console.error('게시글 작성 실패:', error);
        alert('게시글 작성에 실패했습니다.');
      }
    };

    // 단일 게시글 조회
    const fetchBoard = async () => {
      if (!searchId.value) {
        alert('게시글 ID를 입력해주세요.');
        return;
      }
      try {
        const response = await getBoard(searchId.value);
        board.value = response;
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글 조회에 실패했습니다.');
      }
    };

    // 게시글 리스트 조회
    const fetchBoardList = async () => {
      try {
        const response = await api.get<BoardResponse[]>('/api/board-all');
        boardList.value = response.data;
        console.log(response.data)
      } catch (error) {
        console.error('게시글 리스트 조회 실패:', error);
        alert('게시글 리스트 조회에 실패했습니다.');
      }
    };

    return {
      postRequest,
      submitPost,
      searchId,
      fetchBoard,
      fetchBoardList,
      board,
      boardList,
    };
  },
});
</script>

---

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

form div {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea {
  padding: 8px;
  font-size: 14px;
}

button {
  margin-top: 10px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
}

hr {
  margin: 20px 0;
}

div > p {
  margin: 5px 0;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
