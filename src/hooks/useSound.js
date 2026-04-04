export function useSound() {
  function playCorrect() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(523, ctx.currentTime)
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  }

  function playWrong() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.setValueAtTime(200, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  }

  function playLevelUp() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.2)
    })
  }

  function playDuelWin() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [523, 659, 784, 659, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.25)
      osc.start(ctx.currentTime + i * 0.15)
      osc.stop(ctx.currentTime + i * 0.15 + 0.25)
    })
  }

  return { playCorrect, playWrong, playLevelUp, playDuelWin }
}