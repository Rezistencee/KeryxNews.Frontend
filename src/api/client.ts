import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:5052',
  withCredentials: true,
})
