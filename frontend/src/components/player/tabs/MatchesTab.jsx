import { useState } from 'react'

const RESULT_COLOR = { W: 'text-green-400', L: 'text-red-400', D: 'text-yellow-400' }

export default function MatchesTab({ matches = [], sport }) {
  const [filter, setFilter] = useState('all')
  const isBasketball = sport === 'basketball'

  const filtered = filter === 'all' ? matches
    : matches.filter(m => m.result === filter)

  if (!matches.length) return (
    <EmptyState msg="No matches recorded for this season." />
  )

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all','W','L','D'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter===f?'bg-brand-blue text-white':'border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            {f==='all'?'All results':f==='W'?'Wins':f==='L'?'Losses':'Draws'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((m, i) => (
          <MatchRow key={i} match={m} isBasketball={isBasketball} />
        ))}
      </div>
      {filtered.length === 0 && <EmptyState msg="No matches match this filter." />}
    </div>
  )
}

function MatchRow({ match, isBasketball }) {
  const [expanded, setExpanded] = useState(false)
  const { date, competition, home, away, score, result, started, minutes,
          goals, assists, pts, reb, ast, blk, rating } = match
  const rc = RESULT_COLOR[result] || 'text-gray-400'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-800/50 transition-colors">
        {/* Date */}
        <div className="w-20 shrink-0 text-xs text-gray-500">{date}</div>
        {/* Matchup */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">{home} vs {away}</p>
          <p className="text-xs text-gray-500 mt-0.5">{competition}</p>
        </div>
        {/* Score */}
        <div className="text-sm font-medium text-gray-300 tabular-nums shrink-0">{score}</div>
        {/* Result badge */}
        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
          result==='W'?'bg-green-500/15 text-green-400':result==='L'?'bg-red-500/15 text-red-400':'bg-yellow-500/15 text-yellow-400'
        }`}>{result}</div>
        {/* Key stat */}
        <div className="w-24 text-right shrink-0 hidden sm:block">
          {isBasketball
            ? <span className="text-sm text-white">{pts}pts / {reb}reb</span>
            : <span className="text-sm text-white">{goals ?? 0}G {assists ?? 0}A</span>
          }
        </div>
        <span className="text-gray-600 text-xs ml-1">{expanded?'▲':'▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-0">
          <StatPill label="Status" value={started ? 'Started' : 'Sub'} />
          {minutes && <StatPill label="Minutes" value={`${minutes}'`} />}
          {rating && <StatPill label="Rating" value={rating} highlight />}
          {isBasketball ? (
            <>
              {pts!=null&&<StatPill label="Points" value={pts}/>}
              {reb!=null&&<StatPill label="Rebounds" value={reb}/>}
              {ast!=null&&<StatPill label="Assists" value={ast}/>}
              {blk!=null&&<StatPill label="Blocks" value={blk}/>}
            </>
          ) : (
            <>
              {goals!=null&&<StatPill label="Goals" value={goals}/>}
              {assists!=null&&<StatPill label="Assists" value={assists}/>}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function StatPill({ label, value, highlight }) {
  return (
    <div className="bg-gray-800 rounded-lg p-2.5 text-center">
      <p className={`text-base font-semibold tabular-nums ${highlight?'text-brand-blue':'text-white'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function EmptyState({ msg }) {
  return <div className="py-16 text-center text-gray-600"><p className="text-4xl mb-3">📅</p><p className="text-sm">{msg}</p></div>
}
