import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTransactions } from '../services/api'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getTransactions({ limit: 50 })
      .then(res => setTransactions(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <span className="font-bold">FraudGuard</span>
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white text-sm">← Dashboard</button>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">All Transactions</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr className="text-gray-400 text-xs uppercase">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Merchant</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Fraud Score</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{t.id?.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-white font-medium">${Number(t.amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-300">{t.merchant || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{t.location || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs font-semibold ${
                      t.fraud_score > 0.75 ? 'text-red-400' :
                      t.fraud_score > 0.4  ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {t.fraud_score?.toFixed(3) ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      t.status === 'flagged'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="text-center text-gray-500 py-8">Loading...</p>}
          {!loading && transactions.length === 0 && (
            <p className="text-center text-gray-500 py-8">No transactions found</p>
          )}
        </div>
      </div>
    </div>
  )
}