<template>
  <div class="container">
    <h1>회원가입</h1>
    <div v-if="errorMessage" id="error-message" style="color: red;">{{ errorMessage }}</div>
    <div class="form-group">
      <label for="username">사용자 이름:</label>
      <input
        type="text"
        id="username"
        v-model="username"
        placeholder="사용자 이름을 입력하세요"
        class="input"
      />
    </div>
    <div class="form-group">
      <label for="password">비밀번호:</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="비밀번호를 입력하세요"
        class="input"
      />
    </div>
    <div class="form-group">
      <label for="confirmPassword">비밀번호 확인:</label>
      <input
        type="password"
        id="confirmPassword"
        v-model="confirmPassword"
        placeholder="비밀번호를 다시 입력하세요"
        class="input"
      />
    </div>
    <div class="form-group">
      <button @click="submitSignup" class="btn">회원가입</button>
    </div>
    <div class="form-group">
      <a href="/login" class="link">이미 계정이 있으신가요? 로그인</a>
    </div>
  </div>
</template>

<script>
import api from "@/services/api.ts";

export default {
  name: "SignupForm",
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
    };
  },
  methods: {
    async submitSignup() {
      // 입력값 검증
      if (!this.username || !this.password || !this.confirmPassword) {
        this.errorMessage = "모든 필드를 채워주세요.";
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "비밀번호가 일치하지 않습니다.";
        return;
      }

      // 서버로 데이터 전송
      try {
        const response = await api.post("/api/user/join", {
          username: this.username,
          password: this.password,
        });

        console.log(response);
        if (response.status === 201) {
          alert("회원가입이 완료되었습니다.");
          this.$router.push("/login"); // Vue Router로 로그인 페이지 이동
        } else {
          this.errorMessage = response.data.message || "회원가입에 실패했습니다.";
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = "서버 오류가 발생했습니다.";
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}

.link {
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

#error-message {
  margin-bottom: 15px;
}
</style>
