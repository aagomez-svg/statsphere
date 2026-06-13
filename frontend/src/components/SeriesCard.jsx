export default function SeriesCard({ series }) {
  if (!series) return null
  const { team1, team2, wins1, wins2, status, nextGame } = series

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs text-gray-500">{series.label} · In progress</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1">
          <p className="text-2xl font-semibold text-white">{team1}</p>
          <p className="text-xs text-gray-500 mt-1">{series.name1}</p>
          <p className="text-4xl font-semibold text-brand-blue mt-2">{wins1}</p>
        </div>
        <div className="text-gray-700 text-sm">vs</div>
        <div className="text-center flex-1">
          <p className="text-2xl font-semibold text-white">{team2}</p>
          <p className="text-xs text-gray-500 mt-1">{series.name2}</p>
          <p className="text-4xl font-semibold text-brand-blue mt-2">{wins2}</p>
        </div>
      </div>

      {nextGame && (
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">{nextGame.label}</span>
            {' · '}{nextGame.time}
          </p>
          {nextGame.prob && (
            <span className="inline-block mt-2 text-xs bg-brand-light/10 text-brand-blue px-3 py-1 rounded-full">
              Win probability · {team1} {nextGame.prob.t1}% · {team2} {nextGame.prob.t2}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
