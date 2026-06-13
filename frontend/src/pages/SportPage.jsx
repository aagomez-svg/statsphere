import { useCallback } from 'react'
import { useSports } from '../hooks/useSports'
import { fetchNBA, fetchNHL, fetchMLB, fetchWC } from '../api/sports'
import SeriesCard from '../components/SeriesCard'
import GameCard from '../components/GameCard'
import AIPreview from '../components/AIPreview'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

const FETCHERS = {
  nba: fetchNBA,
  nhl: fetchNHL,
  mlb: fetchMLB,
  worldcup: fetchWC,
}

const TITLES = {
  nba: { emoji: '🏀', label: 'NBA Finals' },
  nhl: { emoji: '🏒', label: 'Stanley Cup Final' },
  mlb: { emoji: '⚾', label: 'MLB — Today' },
  worldcup: { emoji: '⚽', label: '2026 World Cup' },
}

export default function SportPage({ sport }) {
  const fetcher = useCallback(FETCHERS[sport], [sport])
  const { data, loading, error, refetch, lastUpdated } = useSports(fetcher)
  const { emoji, label } = TITLES[sport] || {}

  if (loading) return <LoadingState label={`Loading ${label}…`} />
  if (error)   return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>{emoji}</span> {label}
        </h1>
        {lastUpdated && (
          <p className="text-xs text-gray-600">
            Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {data?.series && (
        <SeriesCard series={data.series} />
      )}

      {data?.series && (
        <AIPreview
          sport={sport}
          context={JSON.stringify(data.series)}
        />
      )}

      {data?.games && (
        <>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            {data.games_label || 'Games'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.games.map((game, i) => (
              <GameCard key={game.id ?? i} game={game} highlight={game.highlight} />
            ))}
          </div>
        </>
      )}

      {data?.sections?.map(section => (
        <div key={section.label} className="mt-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            {section.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.games.map((game, i) => (
              <GameCard key={game.id ?? i} game={game} highlight={game.highlight} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
