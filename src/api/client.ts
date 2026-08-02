import axios from 'axios'

// In production (Vercel), VITE_API_BASE_URL is set to the deployed Railway
// backend URL. Locally, it falls back to localhost:8080 when the env
// variable isn't set (e.g. running `npm run dev` without a .env file).
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
})