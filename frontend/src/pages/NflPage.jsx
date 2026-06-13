import { useCallback, useState, useEffect } from 'react'
import { useSports } from '../hooks/useSports'
import { fetchNFL } from '../api/sports'
import GameCard from '../components/GameCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

export default function NflPage() {
  const fetcher = useCallback(fetchNFL, [])
  const { data, loading, error, refetch, lastUpdated } = useSports(fetcher)
  const countdown = useCountdown('2026-08-06T17:00:00-07:00')

  if (loading) return <LoadingState label="Loading NFL…" />
  if (error)   return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          🏈 NFL
        </h1>
        {lastUpdated && (
          <p className="text-xs text-gray-600">
            Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {/* Super Bowl result */}
      {data?.super_bowl && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 mb-5">
          <p className="text-xs text-gray-500 mb-3">🏆 Super Bowl LX · Feb 8, 2026 · Final</p>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-semibold text-white">{data.super_bowl.winner}</p>
              <p className="text-xs text-gray-500 mt-1">{data.super_bowl.winner_name}</p>
              <p className="text-4xl font-semibold text-brand-blue mt-2">{data.super_bowl.winner_score}</p>
              <p className="text-xs text-brand-blue mt-1">Champions 🏆</p>
            </div>
            <p className="text-gray-700 text-sm">vs</p>
            <div className="text-center">
              <p className="text-2xl font-semibold text-white">{data.super_bowl.loser}</p>
              <p className="text-xs text-gray-500 mt-1">{data.super_bowl.loser_name}</p>
              <p className="text-4xl font-semibold text-gray-600 mt-2">{data.super_bowl.loser_score}</p>
            </div>
          </div>
        </div>
      )}

      {/* Countdown */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 mb-5">
        <p className="text-sm text-gray-400 mb-3 font-medium">Preseason countdown</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { val: countdown.days,    label: 'days' },
            { val: countdown.hours,   label: 'hours' },
            { val: countdown.minutes, label: 'min' },
            { val: countdown.seconds, label: 'sec' },
          ].map(({ val, label }) => (
            <div key={label} className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-3xl font-semibold text-white tabular-nums">
                {String(val ?? 0).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          Until the Hall of Fame Game · Cardinals vs Panthers · Aug 6, 2026
        </p>
      </div>

      {/* Preseason games */}
      {data?.preseason && (
        <>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            2026 preseason schedule
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.preseason.map((game, i) => (
              <GameCard key={game.id ?? i} game={game} highlight={game.highlight} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
