import api from './api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
  };
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { username, password });
  return response.data;
};
