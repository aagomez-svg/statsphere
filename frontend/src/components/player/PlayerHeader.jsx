export default function PlayerHeader({ player }) {
  const { name, photo, team, position, age, nationality, height, weight, injured, status,
          current_season, sport, contract, market_value, dob } = player

  const season = current_season || {}
  const isBasketball = sport === 'basketball'
  const isSoccer = sport === 'soccer'

  const quickStats = isBasketball
    ? [
        { label: 'PPG',   value: season.pts?.toFixed(1) },
        { label: 'RPG',   value: season.reb?.toFixed(1) },
        { label: 'APG',   value: season.assists?.toFixed(1) },
        { label: 'BPG',   value: season.blk?.toFixed(1) },
        { label: 'GP',    value: season.appearances },
      ]
    : isSoccer
    ? [
        { label: 'Goals',   value: season.goals },
        { label: 'Assists', value: season.assists },
        { label: 'Apps',    value: season.appearances },
        { label: 'Mins',    value: season.minutes ? `${season.minutes}'` : null },
        { label: 'Rating',  value: season.rating },
      ]
    : []

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-1">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {photo ? (
            <img src={photo} alt={name} className="w-20 h-20 rounded-xl object-cover bg-gray-800" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
          ) : null}
          <div className={`w-20 h-20 rounded-xl bg-gray-800 ${photo ? 'hidden' : 'flex'} items-center justify-center text-3xl font-semibold text-gray-600`}>
            {name?.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
        </div>

        {/* Name + identity */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-1">
            <h1 className="text-2xl font-semibold text-white leading-tight">{name}</h1>
            {injured && (
              <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full shrink-0">
                Injured
              </span>
            )}
            {status === 'active' && !injured && (
              <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full shrink-0">
                Active
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
            {team?.name && (
              <span className="flex items-center gap-1.5">
                {team.logo && <img src={team.logo} alt="" className="w-4 h-4 object-contain" />}
                {team.name}
              </span>
            )}
            {position && <span className="text-gray-500">·</span>}
            {position && <span>{position}</span>}
            {player.league?.name && <span className="text-gray-500">·</span>}
            {player.league?.name && <span className="text-gray-600">{player.league.name}</span>}
          </div>

          {/* Bio row */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {age   && <span>Age {age}</span>}
            {nationality && <span>{nationality}</span>}
            {height && <span>{height}</span>}
            {weight && <span>{weight}</span>}
            {contract?.end && <span>Contract to {contract.end.slice(0,4)}</span>}
            {market_value && <span className="text-brand-blue">{market_value}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            ♡ Follow
          </button>
          <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Quick stats strip */}
      {quickStats.filter(s => s.value != null).length > 0 && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-800 overflow-x-auto scrollbar-hide">
          {quickStats.filter(s => s.value != null).map(({ label, value }) => (
            <div key={label} className="text-center shrink-0">
              <p className="text-lg font-semibold text-white tabular-nums">{value}</p>
              <p className="text-xs text-gray-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
