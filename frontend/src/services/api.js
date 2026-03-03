// frontend/src/services/api.js
import axios from 'axios'
import { auth } from './firebase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Attach Firebase token to every request automatically
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Transactions
export const getTransactions = (params) =>
  api.get('/api/transactions', { params })

export const createTransaction = (data) =>
  api.post('/api/transactions', data)

// Alerts
export const getAlerts = () =>
  api.get('/api/alerts')

export const reviewAlert = (id, status) =>
  api.patch(`/api/alerts/${id}`, { status })

export default api