export default function SoccerMatchList({ label, matches, highlight }) {
  if (!matches?.length) return null

  return (
    <div className="mb-6">
      <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{label}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {matches.map((m, i) => (
          <SoccerMatchCard key={m.id ?? i} match={m} highlight={highlight} />
        ))}
      </div>
    </div>
  )
}

function SoccerMatchCard({ match, highlight }) {
  const { home, away, score, time, status, stage, matchday } = match
  const isLive = status === 'live'
  const isFinal = status === 'final'
  const homeWin = isFinal && score?.home > score?.away
  const awayWin = isFinal && score?.away > score?.home

  return (
    <div className={`rounded-xl border p-3.5 transition-colors ${
      highlight || isLive
        ? 'border-brand-blue bg-brand-blue/5'
        : 'border-gray-800 bg-gray-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        {isLive ? (
          <span className="flex items-center gap-1.5 text-xs text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Live
          </span>
        ) : (
          <span className="text-xs text-gray-600">
            {stage || (matchday ? `MD ${matchday}` : '')}
          </span>
        )}
        <span className={`text-xs px-1.5 py-0.5 rounded ${
          isFinal ? 'text-gray-600' :
          isLive  ? 'bg-red-500/10 text-red-400' :
                    'text-gray-600'
        }`}>
          {isFinal ? 'FT' : isLive ? '●' : time?.slice(11,16) || '—'}
        </span>
      </div>

      {/* Teams */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${homeWin ? 'font-semibold text-white' : 'text-gray-300'}`}>
            {home?.name || '—'}
          </span>
          <span className={`text-sm tabular-nums shrink-0 ${homeWin ? 'font-semibold text-white' : 'text-gray-500'}`}>
            {score?.home ?? (status === 'scheduled' ? '' : '—')}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${awayWin ? 'font-semibold text-white' : 'text-gray-300'}`}>
            {away?.name || '—'}
          </span>
          <span className={`text-sm tabular-nums shrink-0 ${awayWin ? 'font-semibold text-white' : 'text-gray-500'}`}>
            {score?.away ?? (status === 'scheduled' ? '' : '—')}
          </span>
        </div>
      </div>

      {/* Date for scheduled */}
      {status === 'scheduled' && time && (
        <p className="text-xs text-gray-600 mt-2">{time.slice(0, 10)}</p>
      )}
    </div>
  )
}
