import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Attach Firebase token to every request
api.interceptors.request.use(async (config) => {
  const { getAuth } = await import('firebase/auth')
  const user = getAuth().currentUser
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
export const getAlerts = () => api.get('/api/alerts')

export const reviewAlert = (id, status) =>
  api.patch(`/api/alerts/${id}`, { status })

export default api