import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useFraudAlerts } from '../hooks/useFraudAlerts'
import { getTransactions } from '../services/api'

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const { alerts, connected }           = useFraudAlerts()

  useEffect(() => {
    getTransactions({ limit: 100 })
      .then(res => setTransactions(res.data))
  }, [])

  const totalTxns  = transactions.length
  const fraudCount = transactions.filter(t => t.is_fraud).length
  const fraudRate  = totalTxns > 0 ? ((fraudCount / totalTxns) * 100).toFixed(1) : 0

  return (
    <div className="p-6 space-y-6">

      {/* WebSocket Status */}
      <div className={`flex items-center gap-2 text-sm 
        ${connected ? 'text-green-400' : 'text-red-400'}`}>
        <div className={`w-2 h-2 rounded-full 
          ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
        {connected ? 'Live monitoring active' : 'Disconnected'}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard title="Total Transactions" value={totalTxns} color="blue" />
        <KPICard title="Fraud Detected"    value={fraudCount} color="red" />
        <KPICard title="Fraud Rate"         value={`${fraudRate}%`} color="orange" />
      </div>

      {/* Live Alerts Panel */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3 text-red-400">
          🚨 Live Fraud Alerts ({alerts.length})
        </h2>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {alerts.map((a, i) => (
            <div key={i} className="text-xs p-2 bg-red-900/20 border border-red-800/40 rounded-lg">
              <span className="text-red-400 font-mono">TXN:{a.transaction_id?.slice(0,8)}</span>
              <span className="ml-2 text-gray-400">Score: {a.fraud_score}</span>
            </div>
          ))}
          {alerts.length === 0 && <p className="text-gray-500 text-xs">No alerts yet</p>}
        </div>
      </div>
    </div>
  )
}

const KPICard = ({ title, value, color }) => {
  const colors = { blue: 'text-blue-400', red: 'text-red-400', orange: 'text-orange-400' }
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
      <p className="text-xs text-gray-400 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  )
}