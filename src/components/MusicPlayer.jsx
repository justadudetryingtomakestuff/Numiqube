import '../styles/MusicPlayer.css'
import { useState } from 'react'

function MusicPlayer({
  isPlaying,
  currentMode,
  musicVolume,
  sfxVolume,
  onToggle,
  onMusicVolume,
  onSfxVolume
}) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div className={`music-player ${expanded ? 'expanded' : ''}`}>
      <div className="mp-bar">
        <button className="mp-toggle" onClick={onToggle}>
          {isPlaying ? '🎵' : '🔇'}
        </button>
        <div className="mp-info">
          <span className="mp-mode">{currentMode ?? 'No music'}</span>
          {isPlaying && <span className="mp-playing">▶ playing</span>}
        </div>
        <button className="mp-expand" onClick={() => setExpanded(e => !e)}>
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <div className="mp-controls">
          <div className="mp-slider-row">
            <span>🎵 Music</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={e => onMusicVolume(parseFloat(e.target.value))}
              className="mp-slider"
            />
            <span>{Math.round(musicVolume * 100)}%</span>
          </div>
          <div className="mp-slider-row">
            <span>🔊 SFX</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVolume}
              onChange={e => onSfxVolume(parseFloat(e.target.value))}
              className="mp-slider"
            />
            <span>{Math.round(sfxVolume * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MusicPlayer