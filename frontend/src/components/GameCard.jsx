export default function GameCard({ game, highlight }) {
  const isScheduled = game.status === 'scheduled'
  const isLive = game.status === 'live' || game.status === 'inprogress'
  const homScore = game.scores?.home ?? game.score?.home ?? null
  const awayScore = game.scores?.away ?? game.score?.away ?? null
  const homeWin = homScore !== null && homScore > awayScore
  const awayWin = awayScore !== null && awayScore > homScore

  return (
    <div className={`rounded-xl border p-3.5 transition-colors ${
      highlight
        ? 'border-brand-blue bg-brand-light/5'
        : 'border-gray-800 bg-gray-900'
    }`}>
      {isLive && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400 font-medium">Live</span>
          {game.period && <span className="text-xs text-gray-500">· {game.period}</span>}
        </div>
      )}
      {game.title && (
        <p className="text-xs text-gray-500 mb-2">{game.title}</p>
      )}

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${awayWin ? 'text-white' : 'text-gray-400'}`}>
            {game.away?.name ?? game.away}
          </span>
          <span className={`text-sm tabular-nums font-medium ${awayWin ? 'text-white' : 'text-gray-500'}`}>
            {awayScore ?? '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${homeWin ? 'text-white' : 'text-gray-400'}`}>
            {game.home?.name ?? game.home}
          </span>
          <span className={`text-sm tabular-nums font-medium ${homeWin ? 'text-white' : 'text-gray-500'}`}>
            {homScore ?? '—'}
          </span>
        </div>
      </div>

      {game.time && (
        <p className="text-xs text-gray-600 mt-2">{game.time}</p>
      )}
      {game.win_probability && isScheduled && (
        <div className="mt-2 pt-2 border-t border-gray-800">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{game.away?.abbr ?? game.away}</span>
            <span>{game.home?.abbr ?? game.home}</span>
          </div>
          <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-800">
            <div
              className="bg-brand-blue"
              style={{ width: `${game.win_probability.away}%` }}
            />
            <div
              className="bg-gray-600"
              style={{ width: `${game.win_probability.home}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{game.win_probability.away}%</span>
            <span>{game.win_probability.home}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
