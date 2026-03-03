import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useStore'
import { getTransactions } from '../services/api'
import { useFraudAlerts } from '../hooks/useFraudAlerts'

export default function Dashboard() {
  const { user, logout }              = useAuthStore()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const { alerts, connected }           = useFraudAlerts()
  const navigate = useNavigate()

  useEffect(() => {
    getTransactions({ limit: 100 })
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const totalTxns  = transactions.length
  const fraudCount = transactions.filter(t => t.is_fraud).length
  const fraudRate  = totalTxns > 0 ? ((fraudCount / totalTxns) * 100).toFixed(1) : '0.0'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-bold text-white">FraudGuard</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/transactions')} className="text-gray-400 hover:text-white text-sm transition-colors">Transactions</button>
          <button onClick={() => navigate('/alerts')} className="text-gray-400 hover:text-white text-sm transition-colors">Alerts</button>
          <button onClick={handleLogout} className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg transition-colors">Logout</button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time fraud monitoring</p>
        </div>

        {/* WebSocket Status */}
        <div className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${
          connected
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          {connected ? 'Live monitoring active' : 'Disconnected from server'}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard title="Total Transactions" value={loading ? '...' : totalTxns} color="blue" />
          <KPICard title="Fraud Detected"     value={loading ? '...' : fraudCount} color="red" />
          <KPICard title="Fraud Rate"          value={loading ? '...' : `${fraudRate}%`} color="orange" />
        </div>

        {/* Live Alerts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-red-400 flex items-center gap-2">
              🚨 Live Fraud Alerts
              {alerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{alerts.length}</span>
              )}
            </h2>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No alerts yet — monitoring for fraud...</p>
            ) : (
              alerts.map((a, i) => (
                <div key={i} className="flex items-center justify-between bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-3">
                  <span className="text-red-400 font-mono text-xs">TXN: {a.transaction_id?.slice(0, 8)}...</span>
                  <span className="text-gray-400 text-xs">Score: <span className="text-red-400 font-semibold">{a.fraud_score}</span></span>
                  <span className="text-gray-500 text-xs">{new Date(a.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase border-b border-gray-800">
                  <th className="text-left pb-3">ID</th>
                  <th className="text-left pb-3">Amount</th>
                  <th className="text-left pb-3">Merchant</th>
                  <th className="text-left pb-3">Score</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.slice(0, 10).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 font-mono text-xs text-gray-400">{t.id?.slice(0, 8)}...</td>
                    <td className="py-3 text-white">${Number(t.amount).toFixed(2)}</td>
                    <td className="py-3 text-gray-300">{t.merchant || '—'}</td>
                    <td className="py-3">
                      <span className={`font-mono text-xs ${t.fraud_score > 0.75 ? 'text-red-400' : t.fraud_score > 0.4 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {t.fraud_score?.toFixed(3) ?? '—'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        t.status === 'flagged'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && !loading && (
              <p className="text-gray-500 text-sm text-center py-8">No transactions yet</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

function KPICard({ title, value, color }) {
  const colors = {
    blue:   'text-blue-400',
    red:    'text-red-400',
    orange: 'text-orange-400',
  }
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{title}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  )
}