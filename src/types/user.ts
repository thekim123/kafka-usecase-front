class User {
  username: string;
  role: string;

  constructor(username: string, role: string) {
    this.username = username;
    this.role = role;
  }

  // 유저 정보 디스플레이 메서드 (예시)
  getDisplayName(): string {
    return `${this.username} (${this.role})`;
  }
}
