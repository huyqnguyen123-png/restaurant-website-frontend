import axios from 'axios'

// Points to the website-backend. Update this to the deployed Railway URL
// once the backend goes live — for now, local development uses port 8080.
export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
})