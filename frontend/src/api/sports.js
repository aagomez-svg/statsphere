import axios from 'axios'

const BASE = 'https://statsphere-production.up.railway.app/api'

export const fetchNBA       = () => axios.get(`${BASE}/nba`).then(r => r.data)
export const fetchNHL       = () => axios.get(`${BASE}/nhl`).then(r => r.data)
export const fetchMLB       = () => axios.get(`${BASE}/mlb`).then(r => r.data)
export const fetchNFL       = () => axios.get(`${BASE}/nfl`).then(r => r.data)
export const fetchWC        = () => axios.get(`${BASE}/worldcup`).then(r => r.data)
export const fetchSoccerNav        = () => axios.get(`${BASE}/soccer/nav`).then(r => r.data)
export const fetchSoccerComp       = (id) => axios.get(`${BASE}/soccer/${id}`).then(r => r.data)
export const fetchSoccerRegion     = (region) => axios.get(`${BASE}/soccer/region/${encodeURIComponent(region)}`).then(r => r.data)
export const searchSoccer          = (q) => axios.get(`${BASE}/soccer/search`, { params: { q } }).then(r => r.data)
export const fetchFeaturedPlayers  = ()       => axios.get(`${BASE}/players/featured`).then(r => r.data)
export const searchPlayers         = (q, sport) => axios.get(`${BASE}/players/search`, { params: { q, sport } }).then(r => r.data)
export const fetchPlayer           = (id)     => axios.get(`${BASE}/players/${id}`).then(r => r.data)
export const fetchPlayerMatches    = (id, season) => axios.get(`${BASE}/players/${id}/matches`, { params: { season } }).then(r => r.data)
export const fetchPlayerStats      = (id, season) => axios.get(`${BASE}/players/${id}/stats`, { params: { season } }).then(r => r.data)
export const fetchPlayerNews       = (id)     => axios.get(`${BASE}/players/${id}/news`).then(r => r.data)
export const fetchAIPreview        = (sport, context) =>
  axios.post(`${BASE}/ai/preview`, { sport, context }).then(r => r.data)
