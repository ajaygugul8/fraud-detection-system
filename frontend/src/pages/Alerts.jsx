import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAlerts } from '../services/api'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getAlerts()
      .then(res => setAlerts(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <span className="font-bold">FraudGuard</span>
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white text-sm">← Dashboard</button>
      </nav>

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Fraud Alerts</h1>

        <div className="space-y-3">
          {loading && <p className="text-gray-500">Loading alerts...</p>}
          {!loading && alerts.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400">No fraud alerts found</p>
            </div>
          )}
          {alerts.map((a) => (
            <div key={a.id} className="bg-gray-900 border border-red-900/30 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-mono text-sm">TXN: {a.transaction_id?.slice(0, 8)}...</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  a.review_status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                  {a.review_status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2">{a.reason || 'High fraud score detected'}</p>
              <p className="text-gray-600 text-xs mt-2">{new Date(a.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}