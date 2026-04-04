import { useEffect, useRef, useState } from 'react'

const TRACKS = {
  general: ['General1.mp3'],
  study: ['Study1.mp3', 'Study2.mp3', 'Study3.mp3'],
  duel: ['Duel1.mp3', 'Duel2.mp3'],
  speedmode: ['Speedmode1.mp3', 'Speedmode2.mp3']
}

export function useMusic() {
  const audioRef = useRef(null)
  const [currentMode, setCurrentMode] = useState(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [musicVolume, setMusicVolume] = useState(0.5)
  const [sfxVolume, setSfxVolume] = useState(0.5)

  function getRandomTrack(mode, currentIndex) {
    const tracks = TRACKS[mode]
    if (tracks.length === 1) return 0
    let next = currentIndex
    while (next === currentIndex) {
      next = Math.floor(Math.random() * tracks.length)
    }
    return next
  }

  function playMode(mode) {
    if (currentMode === mode && isPlaying) return
    const tracks = TRACKS[mode]
    if (!tracks) return

    const index = Math.floor(Math.random() * tracks.length)
    setCurrentMode(mode)
    setTrackIndex(index)

    if (audioRef.current) {
      audioRef.current.pause()
    }

  const audio = new Audio(`/music/${tracks[index]}?v=${Date.now()}`)
    audio.volume = musicVolume
    audio.loop = tracks.length === 1
    audioRef.current = audio

    audio.play().catch(() => {})
    setIsPlaying(true)

    // When track ends, play next one
    audio.onended = () => {
      if (tracks.length > 1) {
        const nextIndex = getRandomTrack(mode, index)
        setTrackIndex(nextIndex)
    const nextAudio = new Audio(`/music/${tracks[nextIndex]}?v=${Date.now()}`)
        nextAudio.volume = musicVolume
        audioRef.current = nextAudio
        nextAudio.play().catch(() => {})
        nextAudio.onended = audio.onended
      }
    }
  }

  function stopMusic() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentMode(null)
  }

  function toggleMusic() {
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current?.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  function changeMusicVolume(vol) {
    setMusicVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }

  function changeSfxVolume(vol) {
    setSfxVolume(vol)
  }

  return {
    playMode,
    stopMusic,
    toggleMusic,
    isPlaying,
    currentMode,
    musicVolume,
    sfxVolume,
    changeMusicVolume,
    changeSfxVolume
  }
}