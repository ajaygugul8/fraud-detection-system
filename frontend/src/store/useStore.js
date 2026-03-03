// frontend/src/store/useStore.js
import { create } from 'zustand'
import { onAuthChange, logout } from '../services/firebase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // Call this once in App.jsx to listen for auth changes
  init: () => {
    onAuthChange((user) => {
      set({ user, loading: false })
    })
  },

  logout: async () => {
    await logout()
    set({ user: null })
  }
}))