export default function ProfileTab({ player }) {
  const { dob, nationality, birth_place, birth_country, height, weight,
          dominant_foot, position, team, league, contract, market_value,
          current_season, sport, status, social } = player
  const age = dob ? Math.floor((Date.now() - new Date(dob)) / 31557600000) : player.age
  const isBasketball = sport === 'basketball'
  const season = current_season || {}
  const sectionCls = "bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4"
  const rowCls = "flex justify-between items-center py-2 border-b border-gray-800 last:border-0 text-sm"
  const labelCls = "text-gray-500"
  const valCls = "text-gray-200 font-medium"
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className={sectionCls}>
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Personal</h2>
        {dob && <div className={rowCls}><span className={labelCls}>Date of birth</span><span className={valCls}>{dob} (age {age})</span></div>}
        {nationality && <div className={rowCls}><span className={labelCls}>Nationality</span><span className={valCls}>{nationality}</span></div>}
        {(birth_place||birth_country) && <div className={rowCls}><span className={labelCls}>Born</span><span className={valCls}>{[birth_place,birth_country].filter(Boolean).join(', ')}</span></div>}
        {height && <div className={rowCls}><span className={labelCls}>Height</span><span className={valCls}>{height}</span></div>}
        {weight && <div className={rowCls}><span className={labelCls}>Weight</span><span className={valCls}>{weight}</span></div>}
        {dominant_foot && <div className={rowCls}><span className={labelCls}>{isBasketball?'Dominant hand':'Preferred foot'}</span><span className={valCls}>{dominant_foot}</span></div>}
      </div>
      <div className={sectionCls}>
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Professional</h2>
        {position && <div className={rowCls}><span className={labelCls}>Position</span><span className={valCls}>{position}</span></div>}
        {team?.name && <div className={rowCls}><span className={labelCls}>Club</span><span className={`${valCls} flex items-center gap-1.5`}>{team.logo&&<img src={team.logo} alt="" className="w-4 h-4 object-contain"/>}{team.name}</span></div>}
        {league?.name && <div className={rowCls}><span className={labelCls}>League</span><span className={valCls}>{league.name}</span></div>}
        {contract?.end && <div className={rowCls}><span className={labelCls}>Contract ends</span><span className={valCls}>{contract.end}</span></div>}
        {contract?.salary && <div className={rowCls}><span className={labelCls}>Salary</span><span className={valCls}>{contract.salary}</span></div>}
        {market_value && <div className={rowCls}><span className={labelCls}>Market value</span><span className="text-brand-blue font-medium">{market_value}</span></div>}
        <div className={rowCls}><span className={labelCls}>Status</span><span className={`font-medium ${player.injured?'text-red-400':'text-green-400'}`}>{player.injured?'Injured':status==='active'?'Active':status}</span></div>
      </div>
      <div className={`${sectionCls} lg:col-span-2`}>
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">{league?.season||'2025–26'} season snapshot</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {(isBasketball?[
            {l:'PPG',v:season.pts?.toFixed(1)},{l:'RPG',v:season.reb?.toFixed(1)},
            {l:'APG',v:season.assists?.toFixed(1)},{l:'BPG',v:season.blk?.toFixed(1)},
            {l:'SPG',v:season.stl?.toFixed(1)},{l:'Games',v:season.appearances},
          ]:[
            {l:'Goals',v:season.goals},{l:'Assists',v:season.assists},
            {l:'Apps',v:season.appearances},{l:'Mins',v:season.minutes},
            {l:'Shots',v:season.shots_total},{l:'Rating',v:season.rating},
          ]).filter(s=>s.v!=null).map(({l,v})=>(
            <div key={l} className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-lg font-semibold text-white tabular-nums">{v}</p>
              <p className="text-xs text-gray-500 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>
      {social&&Object.keys(social).length>0&&(
        <div className={sectionCls}>
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Official social</h2>
          <div className="flex gap-4">
            {social.twitter&&<a href={`https://twitter.com/${social.twitter}`} target="_blank" rel="noreferrer" className="text-sm text-brand-blue hover:underline">@{social.twitter} (X)</a>}
            {social.instagram&&<a href={`https://instagram.com/${social.instagram}`} target="_blank" rel="noreferrer" className="text-sm text-brand-blue hover:underline">Instagram</a>}
          </div>
        </div>
      )}
    </div>
  )
}
