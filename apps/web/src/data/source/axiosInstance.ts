import axios from 'axios';
import { ENV } from '@/shared/config/env';

export const axiosInstance = axios.create({
  baseURL: ENV.apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});
