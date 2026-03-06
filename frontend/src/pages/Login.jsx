import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, loginWithGoogle } from '../services/firebase'
import { syncUser } from '../services/api'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      await syncUser()
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      await syncUser()
      navigate('/')
    } catch (err) {
      setError('Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-mono uppercase tracking-widest">Fraud Detection System</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to your analyst dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@company.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-black font-semibold rounded-lg px-4 py-3 text-sm transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="flex items-center gap-3 pt-2">
              <div className="h-px bg-gray-800 flex-1" />
              <span className="text-gray-500 text-xs font-mono">or</span>
              <div className="h-px bg-gray-800 flex-1" />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-400 disabled:bg-pink-500/50 text-white font-semibold rounded-lg px-4 py-3 text-sm transition-colors"
            >
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}