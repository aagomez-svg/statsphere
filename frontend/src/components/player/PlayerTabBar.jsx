const TABS = [
  { id: 'profile',  label: 'Profile',  emoji: '👤' },
  { id: 'matches',  label: 'Matches',  emoji: '📅' },
  { id: 'stats',    label: 'Stats',    emoji: '📊' },
  { id: 'career',   label: 'Career',   emoji: '🏆' },
  { id: 'news',     label: 'News',     emoji: '📰' },
]

export default function PlayerTabBar({ activeTab, onChange }) {
  return (
    <div className="flex gap-1 border-b border-gray-800 mb-5 overflow-x-auto scrollbar-hide">
      {TABS.map(({ id, label, emoji }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === id
              ? 'border-brand-blue text-white font-medium'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <span className="hidden sm:inline">{emoji}</span>
          {label}
        </button>
      ))}
    </div>
  )
}
