import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Study from './pages/Study'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Duel from './pages/Duel'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Friends from './pages/Friends'
import MusicPlayer from './components/MusicPlayer'
import { useMusic } from './hooks/useMusic'
import CasualQueue from './pages/CasualQueue'
import RankedQueue from './pages/RankedQueue'
import SetUsername from './pages/SetUsername'


function AppInner() {
  const location = useLocation()
  const {
    playMode, toggleMusic, isPlaying,
    currentMode, musicVolume, sfxVolume,
    changeMusicVolume, changeSfxVolume
  } = useMusic()

  useEffect(() => {
  if (location.pathname === '/study') {
    playMode('study')
  } else if (
    location.pathname === '/duel' ||
    location.pathname === '/casual' ||
    location.pathname === '/ranked'
  ) {
    playMode('duel')
  } else if (location.pathname !== '/') {
    playMode('general')
  }
}, [location.pathname])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<Study />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/duel" element={<Duel />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/casual" element={<CasualQueue />} />
        <Route path="/set-username" element={<SetUsername />} />
<Route path="/ranked" element={<RankedQueue />} />
      </Routes>
      <MusicPlayer
        isPlaying={isPlaying}
        currentMode={currentMode}
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        onToggle={toggleMusic}
        onMusicVolume={changeMusicVolume}
        onSfxVolume={changeSfxVolume}
      />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}

export default App