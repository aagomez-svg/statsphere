import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import SportPage from './pages/SportPage'
import NflPage from './pages/NflPage'
import SoccerHub from './pages/SoccerHub'
import PlayersDirectory from './pages/players/PlayersDirectory'
import PlayerProfile from './pages/players/PlayerProfile'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/"                          element={<Dashboard />} />
            <Route path="/nba"                       element={<SportPage sport="nba" />} />
            <Route path="/nhl"                       element={<SportPage sport="nhl" />} />
            <Route path="/mlb"                       element={<SportPage sport="mlb" />} />
            <Route path="/soccer"                    element={<SoccerHub />} />
            <Route path="/soccer/:compId"            element={<SoccerHub />} />
            <Route path="/nfl"                       element={<NflPage />} />
            <Route path="/players"                   element={<PlayersDirectory />} />
            <Route path="/players/:playerId"         element={<PlayerProfile />} />
            <Route path="/players/:playerId/:tab"    element={<PlayerProfile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
