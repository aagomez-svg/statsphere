import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { fetchPlayer, fetchPlayerMatches, fetchPlayerStats, fetchPlayerNews } from '../../api/sports'
import PlayerHeader from '../../components/player/PlayerHeader'
import PlayerTabBar from '../../components/player/PlayerTabBar'
import ProfileTab  from '../../components/player/tabs/ProfileTab'
import MatchesTab  from '../../components/player/tabs/MatchesTab'
import StatsTab    from '../../components/player/tabs/StatsTab'
import CareerTab   from '../../components/player/tabs/CareerTab'
import NewsTab     from '../../components/player/tabs/NewsTab'
import LoadingState from '../../components/LoadingState'
import ErrorState   from '../../components/ErrorState'

const TAB_PATHS = ['profile','matches','stats','career','news']

export default function PlayerProfile() {
  const { playerId, tab = 'profile' } = useParams()
  const navigate = useNavigate()
  const [player, setPlayer]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Tab-specific data
  const [matches, setMatches] = useState(null)
  const [stats, setStats]     = useState(null)
  const [news, setNews]       = useState(null)
  const [tabLoading, setTabLoading] = useState(false)

  // Load player on mount
  useEffect(() => {
    setLoading(true)
    fetchPlayer(playerId)
      .then(setPlayer)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [playerId])

  // Load tab data lazily
  useEffect(() => {
    if (!player) return
    if (tab === 'matches' && !matches) {
      setTabLoading(true)
      fetchPlayerMatches(playerId).then(d => setMatches(d.matches)).finally(() => setTabLoading(false))
    }
    if (tab === 'stats' && !stats) {
      setTabLoading(true)
      fetchPlayerStats(playerId).then(setStats).finally(() => setTabLoading(false))
    }
    if (tab === 'news' && !news) {
      setTabLoading(true)
      fetchPlayerNews(playerId).then(d => setNews(d.news)).finally(() => setTabLoading(false))
    }
  }, [tab, player, playerId])

  const changeTab = (newTab) => {
    navigate(`/players/${playerId}/${newTab}`, { replace: true })
  }

  if (loading) return <LoadingState label="Loading player profile…" />
  if (error)   return <ErrorState message={error} />
  if (!player) return <ErrorState message="Player not found." />

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-14 z-40 bg-gray-950 pb-1">
        <PlayerHeader player={player} />
        <PlayerTabBar activeTab={tab} onChange={changeTab} />
      </div>

      {/* Tab content */}
      <div className="mt-2">
        {tab === 'profile' && <ProfileTab player={player} />}
        {tab === 'matches' && (
          tabLoading ? <LoadingState label="Loading matches…" /> :
          <MatchesTab matches={matches ?? player.recent_matches ?? []} sport={player.sport} />
        )}
        {tab === 'stats' && (
          tabLoading ? <LoadingState label="Loading stats…" /> :
          <StatsTab stats={stats} sport={player.sport} />
        )}
        {tab === 'career' && <CareerTab player={player} />}
        {tab === 'news' && (
          tabLoading ? <LoadingState label="Loading news…" /> :
          <NewsTab news={news ?? player.news ?? []} />
        )}
      </div>
    </div>
  )
}
