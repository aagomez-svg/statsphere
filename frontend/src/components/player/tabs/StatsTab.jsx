const SOCCER_CATEGORIES = [
  { label: 'Attacking',  keys: [['goals','Goals'],['assists','Assists'],['shots_total','Shots'],['shots_on','On Target'],['passes_key','Key Passes']] },
  { label: 'Passing',    keys: [['passes_total','Total Passes'],['passes_accuracy','Pass Accuracy %'],['dribbles_success','Successful Dribbles']] },
  { label: 'Defending',  keys: [['tackles_total','Tackles'],['interceptions','Interceptions']] },
  { label: 'General',    keys: [['appearances','Appearances'],['lineups','Starts'],['minutes','Minutes Played'],['rating','Avg Rating']] },
  { label: 'Discipline', keys: [['yellow_cards','Yellow Cards'],['red_cards','Red Cards']] },
]
const BASKETBALL_CATEGORIES = [
  { label: 'Scoring',     keys: [['pts','PPG'],['fg_pct','FG%'],['fg3_pct','3P%'],['ft_pct','FT%']] },
  { label: 'Playmaking',  keys: [['assists','APG'],['turnover','TOV']] },
  { label: 'Rebounding',  keys: [['reb','RPG']] },
  { label: 'Defense',     keys: [['stl','SPG'],['blk','BPG']] },
  { label: 'General',     keys: [['appearances','Games'],['minutes','MIN/G']] },
]

function fmt(key, val) {
  if (val == null) return '—'
  if (['fg_pct','fg3_pct','ft_pct'].includes(key)) return `${(val*100).toFixed(1)}%`
  if (key === 'passes_accuracy') return `${val}%`
  if (key === 'minutes') return typeof val === 'number' ? val.toFixed(1) : val
  if (typeof val === 'number') return Number.isInteger(val) ? val : val.toFixed(1)
  return val
}

export default function StatsTab({ stats, sport }) {
  const season = stats?.current_season || {}
  const cats = sport === 'basketball' ? BASKETBALL_CATEGORIES : SOCCER_CATEGORIES

  if (!Object.keys(season).length) return (
    <div className="py-16 text-center text-gray-600"><p className="text-4xl mb-3">📊</p><p className="text-sm">No stats available for this season.</p></div>
  )

  return (
    <div className="space-y-4">
      {cats.map(cat => {
        const rows = cat.keys.filter(([k]) => season[k] != null)
        if (!rows.length) return null
        return (
          <div key={cat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">{cat.label}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {rows.map(([k, label]) => (
                <div key={k} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xl font-semibold text-white tabular-nums">{fmt(k, season[k])}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Export CTA */}
      <div className="text-center pt-2">
        <button className="text-xs text-gray-600 hover:text-gray-400 transition-colors border border-gray-800 rounded-lg px-4 py-2">
          Export stats as CSV
        </button>
      </div>
    </div>
  )
}
