import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchFeaturedPlayers, searchPlayers } from '../../api/sports'
import LoadingState from '../../components/LoadingState'

export default function PlayersDirectory() {
  const [featured, setFeatured]   = useState([])
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchFeaturedPlayers().then(d => setFeatured(d.players || []))
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults(null); return }
    const t = setTimeout(() => {
      setSearching(true)
      searchPlayers(query)
        .then(d => setResults(d.results || []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false))
    }, 350)
    return () => clearTimeout(t)
  }, [query])

  const SPORT_EMOJI = { soccer: '⚽', basketball: '🏀', baseball: '⚾' }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">👤 Players</h1>
        <p className="text-sm text-gray-500">Search any player across all sports.</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by name (e.g. Mbappé, Wembanyama)…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-blue"
        />
        {searching && (
          <div className="absolute right-3 top-3 w-5 h-5 border-2 border-gray-700 border-t-brand-blue rounded-full animate-spin" />
        )}
      </div>

      {/* Search results */}
      {results && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-3">{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</p>
          {results.length === 0 ? (
            <p className="text-sm text-gray-600 py-4">No players found. Try a different name.</p>
          ) : (
            <div className="space-y-2">
              {results.map(p => (
                <PlayerRow key={p.id} player={p} emoji={SPORT_EMOJI[p.sport] || '🏅'} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Featured players */}
      {!results && (
        <>
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Featured players</h2>
          {featured.length === 0 ? (
            <LoadingState label="Loading players…" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featured.map(p => (
                <PlayerCard key={p.id} player={p} emoji={SPORT_EMOJI[p.sport] || '🏅'} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PlayerRow({ player, emoji }) {
  return (
    <Link to={`/players/${player.id}/profile`}
      className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-3 hover:bg-gray-800 hover:border-gray-700 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg shrink-0">
        {player.photo ? <img src={player.photo} alt="" className="w-full h-full rounded-lg object-cover" /> : emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{player.name}</p>
        <p className="text-xs text-gray-500 truncate">{player.team} · {player.sport}</p>
      </div>
      <span className="text-xs text-brand-blue shrink-0">View →</span>
    </Link>
  )
}

function PlayerCard({ player, emoji }) {
  return (
    <Link to={`/players/${player.id}/profile`}
      className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 hover:border-gray-700 transition-colors group">
      <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
        {player.photo ? <img src={player.photo} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }} /> : null}
        <span className={player.photo ? 'hidden' : ''}>{emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-white truncate">{player.name}</p>
        <p className="text-sm text-gray-500 truncate">{player.team}</p>
        <p className="text-xs text-gray-600 mt-1 capitalize">{player.sport}</p>
      </div>
      <span className="text-brand-blue text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0">View profile →</span>
    </Link>
  )
}
