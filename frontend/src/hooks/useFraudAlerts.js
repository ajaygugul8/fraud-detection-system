import { useEffect, useState, useCallback } from 'react'

export const useFraudAlerts = () => {
  const [alerts, setAlerts]     = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL + '/alerts'
    const ws   = new WebSocket(wsUrl)

    ws.onopen  = () => setConnected(true)
    ws.onclose = () => setConnected(false)

    ws.onmessage = (event) => {
      try {
        const alert = JSON.parse(event.data)
        setAlerts(prev => [alert, ...prev].slice(0, 50))
      } catch (e) {}
    }

    return () => ws.close()
  }, [])

  const clearAlerts = useCallback(() => setAlerts([]), [])

  return { alerts, connected, clearAlerts }
}