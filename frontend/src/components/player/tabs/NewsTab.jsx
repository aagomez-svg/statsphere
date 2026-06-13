import { useState } from 'react'

const TAG_COLORS = {
  'Match Report': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Award':        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Transfer':     'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Injury':       'bg-red-500/10 text-red-400 border-red-500/20',
  'Contract':     'bg-green-500/10 text-green-400 border-green-500/20',
  'Interview':    'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'International':'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
}

const CONFIDENCE_LABEL = {
  'Reliable':    { cls: 'text-yellow-400', label: '🔒 Reliable source' },
  'Unconfirmed': { cls: 'text-gray-500',   label: '❓ Unconfirmed' },
  'Speculation': { cls: 'text-gray-600',   label: '💭 Speculation' },
}

export default function NewsTab({ news = [] }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? news
    : filter === 'rumors' ? news.filter(n => n.rumor)
    : news.filter(n => !n.rumor)

  const tags = ['all', 'news', 'rumors']

  if (!news.length) return (
    <div className="py-16 text-center text-gray-600">
      <p className="text-4xl mb-3">📰</p>
      <p className="text-sm">No recent coverage for this player.</p>
    </div>
  )

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${filter===t?'bg-brand-blue text-white':'border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            {t === 'all' ? `All (${news.length})` : t === 'rumors' ? `Rumors (${news.filter(n=>n.rumor).length})` : `News (${news.filter(n=>!n.rumor).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item, i) => <NewsCard key={i} item={item} />)}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-gray-600 text-sm">Nothing in this category.</div>
        )}
      </div>
    </div>
  )
}

function NewsCard({ item }) {
  const { headline, source, date, excerpt, tag, url, rumor, confidence } = item
  const tagStyle = TAG_COLORS[tag] || 'bg-gray-800 text-gray-400 border-gray-700'
  const conf = confidence ? CONFIDENCE_LABEL[confidence] : null

  return (
    <a href={url || '#'} target="_blank" rel="noreferrer"
      className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 hover:border-gray-700 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${tagStyle}`}>{tag}</span>
          {rumor && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">Rumor</span>}
          {conf && <span className={`text-xs ${conf.cls}`}>{conf.label}</span>}
        </div>
        <span className="text-xs text-gray-600 shrink-0">{date}</span>
      </div>

      <p className="text-sm font-medium text-white group-hover:text-brand-blue transition-colors mb-1 leading-snug">
        {headline}
      </p>
      <p className="text-xs text-gray-500 leading-relaxed mb-2">{excerpt}</p>
      <p className="text-xs text-gray-600">{source} →</p>
    </a>
  )
}
