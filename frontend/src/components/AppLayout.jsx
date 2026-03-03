import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  Siren,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '../store/useStore'
import { cn } from '../lib/cn'
import { Button } from './ui/Button'

function AppNav({ onNavigate }) {
  const location = useLocation()

  const links = useMemo(
    () => [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/transactions', label: 'Transactions', icon: Receipt },
      { to: '/alerts', label: 'Alerts', icon: Siren },
    ],
    [],
  )

  return (
    <nav className="space-y-1">
      {links.map((l) => {
        const Icon = l.icon
        const active = location.pathname === l.to
        return (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
              active
                ? 'bg-white/10 text-white'
                : 'text-zinc-300 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className={cn('h-4 w-4', active ? 'text-emerald-300' : 'text-zinc-400')} />
            {l.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.06]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(16,185,129,0.20),transparent_60%)]" />

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity lg:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-[280px] border-r border-white/10 bg-zinc-950/60 backdrop-blur',
          'transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-emerald-300" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">FraudGuard</p>
              <p className="text-xs text-zinc-400">Realtime monitoring</p>
            </div>
          </div>
          <button
            className="lg:hidden rounded-lg p-2 text-zinc-300 hover:bg-white/5 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 py-3">
          <AppNav onNavigate={() => setSidebarOpen(false)} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <div className="mb-3">
            <p className="text-xs text-zinc-500">Signed in as</p>
            <p className="text-sm font-semibold text-zinc-100 truncate">
              {user?.email ?? '—'}
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full justify-between"
            onClick={handleLogout}
          >
            Logout
            <LogOut className="h-4 w-4 text-zinc-300" />
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="relative lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/40 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200 hover:bg-white/10"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">Fraud Detection Dashboard</p>
                <p className="text-xs text-zinc-400">Monitor, review, and investigate risk</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex"
                onClick={() => navigate('/alerts')}
              >
                View alerts
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

