import { useState, useEffect, useCallback } from 'react'
import { fetchSoccerNav, fetchSoccerComp, searchSoccer } from '../api/sports'
import SoccerMatchList from '../components/SoccerMatchList'
import AIPreview from '../components/AIPreview'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

const TIER_LABEL = {
  international: 'International',
  continental:   'Continental',
  domestic_top:  'League',
  domestic_cup:  'Cup',
}

export default function SoccerHub() {
  const [nav, setNav]           = useState(null)
  const [navError, setNavError] = useState(null)
  const [activeComp, setActiveComp]     = useState(null)
  const [compData, setCompData]         = useState(null)
  const [compLoading, setCompLoading]   = useState(false)
  const [compError, setCompError]       = useState(null)
  const [searchQ, setSearchQ]           = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [openGroup, setOpenGroup]       = useState(null)

  // Load nav on mount
  useEffect(() => {
    fetchSoccerNav()
      .then(d => { setNav(d); setOpenGroup(d.groups[0]?.label) })
      .catch(e => setNavError(e.message))
  }, [])

  // Load competition when selected
  useEffect(() => {
    if (!activeComp) return
    setCompLoading(true)
    setCompError(null)
    setCompData(null)
    fetchSoccerComp(activeComp.id)
      .then(setCompData)
      .catch(e => setCompError(e.message))
      .finally(() => setCompLoading(false))
  }, [activeComp])

  // Debounced search
  useEffect(() => {
    if (searchQ.length < 2) { setSearchResults(null); return }
    const t = setTimeout(() => {
      searchSoccer(searchQ).then(d => setSearchResults(d.results)).catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [searchQ])

  if (navError) return <ErrorState message={navError} />

  return (
    <div className="flex gap-5">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0">
        <div className="sticky top-20">
          {/* Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search competitions…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Search results */}
          {searchResults && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden mb-3">
              {searchResults.length === 0 ? (
                <p className="text-xs text-gray-600 p-3">No results</p>
              ) : searchResults.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setActiveComp(c); setSearchQ(''); setSearchResults(null) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0"
                >
                  <span>{c.flag}</span>
                  <span className="text-gray-300 truncate">{c.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Nav groups */}
          {!nav ? (
            <div className="space-y-1">
              {[...Array(8)].map((_,i) => (
                <div key={i} className="h-8 bg-gray-900 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <nav className="space-y-0.5 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-hide">
              {nav.groups.map(group => (
                <div key={group.label}>
                  <button
                    onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-300 transition-colors"
                  >
                    <span>{group.label}</span>
                    <span className="text-gray-700">{openGroup === group.label ? '▲' : '▼'}</span>
                  </button>
                  {openGroup === group.label && (
                    <div className="space-y-0.5 mb-1">
                      {group.competitions.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setActiveComp(c)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-sm transition-colors ${
                            activeComp?.id === c.id
                              ? 'bg-brand-blue text-white'
                              : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                          }`}
                        >
                          <span className="text-base leading-none">{c.flag}</span>
                          <span className="truncate">{c.short}</span>
                          <span className={`ml-auto text-xs px-1.5 py-0.5 rounded shrink-0 ${
                            activeComp?.id === c.id
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-800 text-gray-600'
                          }`}>
                            {TIER_LABEL[c.tier] || c.tier}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0">
        {!activeComp ? (
          <SoccerLanding nav={nav} onSelect={setActiveComp} />
        ) : compLoading ? (
          <LoadingState label={`Loading ${activeComp.name}…`} />
        ) : compError ? (
          <ErrorState message={compError} onRetry={() => setActiveComp({ ...activeComp })} />
        ) : compData ? (
          <SoccerCompView data={compData} />
        ) : null}
      </main>
    </div>
  )
}

// ── Landing when nothing is selected ──────────────────────────────────────────
function SoccerLanding({ nav, onSelect }) {
  if (!nav) return <LoadingState label="Loading soccer hub…" />
  const featured = ['world_cup','ucl','epl','laliga','libertadores','copa_america','bundesliga','mls']
  const featuredComps = featured.map(id => {
    for (const g of nav.groups) {
      const c = g.competitions.find(c => c.id === id)
      if (c) return c
    }
    return null
  }).filter(Boolean)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">⚽ Soccer Hub</h1>
        <p className="text-sm text-gray-500">
          {nav.total} competitions across every major confederation. Select one from the sidebar or start below.
        </p>
      </div>
      <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Featured competitions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {featuredComps.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-left hover:bg-gray-800 hover:border-gray-700 transition-colors group"
          >
            <p className="text-2xl mb-2">{c.flag}</p>
            <p className="text-sm font-medium text-white">{c.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.region}</p>
            <p className="text-xs text-brand-blue mt-2 opacity-0 group-hover:opacity-100 transition-opacity">View →</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Competition detail view ────────────────────────────────────────────────────
function SoccerCompView({ data }) {
  const { competition, live, recent, upcoming } = data
  const hasLive = live?.length > 0

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">{competition.flag}</span>
        <div>
          <h1 className="text-xl font-semibold text-white">{competition.name}</h1>
          <p className="text-sm text-gray-500">{competition.region} · {TIER_LABEL[competition.tier]}</p>
        </div>
        {hasLive && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Live now
          </span>
        )}
      </div>

      <AIPreview sport="soccer" context={JSON.stringify({ competition, recent: recent?.slice(0,3) })} />

      {hasLive && (
        <SoccerMatchList label="Live" matches={live} highlight />
      )}
      {upcoming?.length > 0 && (
        <SoccerMatchList label="Upcoming" matches={upcoming} />
      )}
      {recent?.length > 0 && (
        <SoccerMatchList label="Recent results" matches={recent} />
      )}
      {!hasLive && !upcoming?.length && !recent?.length && (
        <div className="py-16 text-center text-gray-600">
          <p className="text-4xl mb-3">🏟️</p>
          <p className="text-sm">No recent or upcoming matches found.</p>
          <p className="text-xs mt-1">This competition may be in its off-season or between match days.</p>
        </div>
      )}
    </div>
  )
}
