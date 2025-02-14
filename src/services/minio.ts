import axios from "axios";

const minioClient = axios.create({
  baseURL: import.meta.env.VITE_STORAGE,
});
