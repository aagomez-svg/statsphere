export default function CareerTab({ player }) {
  const { career = [], international } = player

  return (
    <div>
      {/* Club career timeline */}
      <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Club career</h2>
      {career.length === 0 ? (
        <EmptyState msg="No club career data available." />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-800" />
          <div className="space-y-0">
            {career.map((stint, i) => (
              <ClubStint key={i} stint={stint} isFirst={i===0} />
            ))}
          </div>
        </div>
      )}

      {/* International career */}
      {international && (
        <div className="mt-8">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
            International career
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{international.flag}</span>
              <div>
                <p className="text-base font-semibold text-white">{international.country}</p>
                <p className="text-sm text-gray-500">
                  {international.caps} caps
                  {international.goals != null ? ` · ${international.goals} goals` : ''}
                </p>
              </div>
            </div>

            {international.tournaments?.length > 0 && (
              <div className="space-y-3 border-t border-gray-800 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tournament history</p>
                {international.tournaments.map((t, i) => (
                  <TournamentRow key={i} t={t} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!international && (
        <div className="mt-8 py-8 text-center text-gray-600 border border-gray-800 rounded-xl">
          <p className="text-sm">No senior international appearances on record.</p>
        </div>
      )}
    </div>
  )
}

function ClubStint({ stint, isFirst }) {
  const { team, logo, league, country, from, to, role, appearances, goals, assists, pts, trophies = [], awards = [] } = stint
  const hasTrophies = trophies.length > 0
  const hasAwards   = awards.length > 0

  return (
    <div className="relative pl-12 pb-8">
      {/* Timeline dot */}
      <div className={`absolute left-3.5 top-1.5 w-3 h-3 rounded-full border-2 ${isFirst ? 'bg-brand-blue border-brand-blue' : 'bg-gray-700 border-gray-600'}`} />

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        {/* Club header */}
        <div className="flex items-center gap-3 mb-3">
          {logo && <img src={logo} alt="" className="w-8 h-8 object-contain" />}
          <div className="flex-1">
            <p className="text-base font-semibold text-white">{team}</p>
            <p className="text-xs text-gray-500">{league} · {country} · {from}–{to}</p>
          </div>
          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">{role}</span>
          {to === 'Present' && (
            <span className="text-xs text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">Current</span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex gap-4 text-sm flex-wrap mb-3">
          {appearances != null && <span className="text-gray-400"><span className="text-white font-medium">{appearances}</span> apps</span>}
          {goals != null && <span className="text-gray-400"><span className="text-white font-medium">{goals}</span> goals</span>}
          {assists != null && <span className="text-gray-400"><span className="text-white font-medium">{assists}</span> assists</span>}
          {pts != null && <span className="text-gray-400"><span className="text-white font-medium">{pts}</span> PPG</span>}
        </div>

        {/* Trophies */}
        {hasTrophies && (
          <div className="mb-2">
            <p className="text-xs text-gray-600 mb-1.5">Trophies</p>
            <div className="flex flex-wrap gap-1.5">
              {trophies.map((t, i) => (
                <span key={i} className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                  🏆 {t.name} {t.year}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {hasAwards && (
          <div>
            <p className="text-xs text-gray-600 mb-1.5">Individual awards</p>
            <div className="flex flex-wrap gap-1.5">
              {awards.map((a, i) => (
                <span key={i} className="text-xs bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded-full">
                  ⭐ {a.name} {a.year}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TournamentRow({ t }) {
  const statKey = t.goals != null ? `${t.goals}G` : t.pts ? `${t.pts.toFixed(1)}pts` : null
  const resultColor = t.result?.toLowerCase().includes('winner') || t.result?.toLowerCase().includes('gold')
    ? 'text-yellow-400' : t.result?.toLowerCase().includes('runner') || t.result?.toLowerCase().includes('silver')
    ? 'text-gray-300' : 'text-gray-400'

  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-800 last:border-0">
      <div className="flex-1">
        <p className="text-sm text-white font-medium">{t.name} {t.year}</p>
        <p className="text-xs text-gray-500">{t.host}</p>
        {t.awards?.length > 0 && (
          <div className="flex gap-1.5 mt-1 flex-wrap">
            {t.awards.map((a, i) => (
              <span key={i} className="text-xs bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded">⭐ {a}</span>
            ))}
          </div>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-medium ${resultColor}`}>{t.result}</p>
        {statKey && <p className="text-xs text-gray-500 mt-0.5">{statKey}</p>}
      </div>
    </div>
  )
}

function EmptyState({ msg }) {
  return <div className="py-12 text-center text-gray-600"><p className="text-sm">{msg}</p></div>
}
