import { useState } from 'react'
import { fetchAIPreview } from '../api/sports'

export default function AIPreview({ sport, context }) {
  const [insight, setInsight]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const generate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchAIPreview(sport, context)
      setInsight(res.insight)
    } catch {
      setError('Could not generate preview. Check API key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300 font-medium">⚡ AI Game Preview</span>
          <span className="text-xs bg-brand-light/10 text-brand-blue px-2 py-0.5 rounded-full">
            Powered by Claude
          </span>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg bg-brand-blue text-white hover:bg-brand-dark disabled:opacity-50 transition-colors"
        >
          {loading ? 'Generating…' : insight ? 'Refresh' : 'Generate preview'}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      {insight && !loading && (
        <p className="text-sm text-gray-300 leading-relaxed">{insight}</p>
      )}
      {!insight && !loading && !error && (
        <p className="text-xs text-gray-600">Click to get an AI-generated analysis of tonight's matchup.</p>
      )}
    </div>
  )
}
