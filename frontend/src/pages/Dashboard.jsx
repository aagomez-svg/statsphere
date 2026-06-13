import { Link } from 'react-router-dom'

const SPORT_CARDS = [
  { path:'/nba',     emoji:'🏀', sport:'NBA Finals',         status:'In progress',    summary:'Knicks lead Spurs 3–1 · Game 5 tonight',                              live:true,  accent:true },
  { path:'/nhl',     emoji:'🏒', sport:'Stanley Cup Final',  status:'In progress',    summary:'Hurricanes lead Golden Knights 3–2 · Game 6 tomorrow',                 live:true,  accent:true },
  { path:'/mlb',     emoji:'⚾', sport:'MLB',                status:'Season active',  summary:'30 teams · Daily games · Full schedule live',                          live:true,  accent:false },
  { path:'/soccer',  emoji:'⚽', sport:'Soccer Hub',         status:'60 competitions',summary:'World Cup · UCL · EPL · La Liga · Brasileirão · MLS · Libertadores',   live:true,  accent:false, badge:'60 leagues' },
  { path:'/nfl',     emoji:'🏈', sport:'NFL',                status:'Preseason Aug 6',summary:'Seahawks won Super Bowl LX · Preseason in 54 days',                    live:false, accent:false },
  { path:'/players', emoji:'👤', sport:'Player Profiles',    status:'Multi-sport',    summary:'Full profiles · Career timelines · Stats · Match logs · News & rumors', live:false, accent:false, badge:'New' },
]

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">All sports, one place.</h1>
        <p className="text-sm text-gray-500">Live scores, player profiles, and AI-powered previews — updated every minute.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPORT_CARDS.map(({ path, emoji, sport, status, summary, live, accent, badge }) => (
          <Link key={path} to={path}
            className={`rounded-xl border p-5 hover:bg-gray-800 transition-colors group ${accent?'border-brand-blue bg-gray-900':'border-gray-800 bg-gray-900'}`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{emoji}</span>
              <div className="flex items-center gap-2">
                {badge && <span className="text-xs bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-full">{badge}</span>}
                {live && <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>Live</span>}
              </div>
            </div>
            <p className="text-sm font-medium text-white mb-0.5">{sport}</p>
            <p className="text-xs text-gray-500 mb-3">{status}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{summary}</p>
            <p className="text-xs text-brand-blue mt-3 opacity-0 group-hover:opacity-100 transition-opacity">View details →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
