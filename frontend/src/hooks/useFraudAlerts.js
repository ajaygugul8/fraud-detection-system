import { useEffect, useState } from 'react'

export const useFraudAlerts = () => {
  const [alerts, setAlerts]       = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/alerts`)

    ws.onopen    = () => setConnected(true)
    ws.onclose   = () => setConnected(false)
    ws.onerror   = () => setConnected(false)
    ws.onmessage = (event) => {
      try {
        const alert = JSON.parse(event.data)
        setAlerts(prev => [alert, ...prev].slice(0, 50))
      } catch (e) {}
    }

    return () => ws.close()
  }, [])

  return { alerts, connected }
}