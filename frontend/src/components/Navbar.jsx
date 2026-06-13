import { Link, useLocation } from 'react-router-dom'

const SPORTS = [
  { path: '/',        label: 'All',     emoji: '⚡' },
  { path: '/nba',     label: 'NBA',     emoji: '🏀' },
  { path: '/nhl',     label: 'NHL',     emoji: '🏒' },
  { path: '/mlb',     label: 'MLB',     emoji: '⚾' },
  { path: '/soccer',  label: 'Soccer',  emoji: '⚽' },
  { path: '/nfl',     label: 'NFL',     emoji: '🏈' },
  { path: '/players', label: 'Players', emoji: '👤' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <span className="text-xl font-semibold tracking-tight">
            Stat<span className="text-brand-blue">Sphere</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {SPORTS.map(({ path, label, emoji }) => {
            const active = path === '/soccer'
              ? pathname.startsWith('/soccer')
              : path === '/players'
              ? pathname.startsWith('/players')
              : pathname === path
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  active ? 'bg-brand-blue text-white font-medium' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                }`}>
                <span>{emoji}</span>{label}
              </Link>
            )
          })}
        </div>
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
    </nav>
  )
}
