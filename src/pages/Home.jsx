import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()
  const { user, login, logout } = useAuth()
  const [mode, setMode] = useState('home') // home, login, signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogleLogin() {
    try {
      setLoading(true)
      await login()
      navigate('/dashboard')
    } catch (err) {
      setError('Google sign in failed. Try again!')
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailLogin() {
    try {
      setLoading(true)
      setError('')
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const { auth } = await import('../firebase/config')
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password!')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp() {
    if (!name.trim()) { setError('Please enter your name!'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters!'); return }
    try {
      setLoading(true)
      setError('')
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
      const { auth } = await import('../firebase/config')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
      navigate('/dashboard')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use! Try logging in.')
      } else {
        setError('Sign up failed. Try again!')
      }
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="home">
        <div className="home-inner">
          <div className="home-logo">
  <div className="logo-cube">
    <div className="cube-face face-front">N</div>
    <div className="cube-face face-back">Q</div>
    <div className="cube-face face-right">M</div>
    <div className="cube-face face-left">U</div>
    <div className="cube-face face-top">I</div>
    <div className="cube-face face-bottom">B</div>
  </div>
</div>
          <h1 className="home-title">Numiqube</h1>
          <p className="home-motto">Math that sticks. Progress that shows.</p>

          <div className="user-card">
            {user.photoURL
              ? <img src={user.photoURL} alt="avatar" className="user-card-avatar" referrerPolicy="no-referrer" />
              : <div className="user-card-avatar-placeholder">{user.displayName?.[0] ?? '?'}</div>
            }
            <div className="user-card-info">
              <strong>{user.displayName}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <div className="home-btns">
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard 🚀
            </button>
            <button className="btn-secondary" onClick={() => { logout(); }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'login') {
    return (
      <div className="home">
        <div className="home-inner">
          <div className="home-logo">
  <div className="logo-cube">
    <div className="cube-face face-front">N</div>
    <div className="cube-face face-back">Q</div>
    <div className="cube-face face-right">M</div>
    <div className="cube-face face-left">U</div>
    <div className="cube-face face-top">I</div>
    <div className="cube-face face-bottom">B</div>
  </div>
</div>
          <h1 className="home-title">Welcome Back!</h1>
          <p className="home-sub">Sign in to continue your journey</p>

          <div className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="btn-primary" onClick={handleEmailLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="auth-divider">or</div>
            <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              Continue with Google
            </button>
            <button className="auth-switch" onClick={() => { setMode('signup'); setError('') }}>
              Don't have an account? <strong>Sign Up</strong>
            </button>
            <button className="auth-switch" onClick={() => { setMode('home'); setError('') }}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'signup') {
    return (
      <div className="home">
        <div className="home-inner">
         <div className="home-logo">
  <div className="logo-cube">
    <div className="cube-face face-front">N</div>
    <div className="cube-face face-back">Q</div>
    <div className="cube-face face-right">M</div>
    <div className="cube-face face-left">U</div>
    <div className="cube-face face-top">I</div>
    <div className="cube-face face-bottom">B</div>
  </div>
</div>
          <h1 className="home-title">Create Account</h1>
          <p className="home-sub">Join Numiqube and start your math journey!</p>

          <div className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            <input className="auth-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="auth-input" type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="btn-primary" onClick={handleSignUp} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account 🚀'}
            </button>
            <div className="auth-divider">or</div>
            <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              Continue with Google
            </button>
            <button className="auth-switch" onClick={() => { setMode('login'); setError('') }}>
              Already have an account? <strong>Sign In</strong>
            </button>
            <button className="auth-switch" onClick={() => { setMode('home'); setError('') }}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home">
      <div className="home-inner">
     <div className="home-logo">
  <div className="logo-cube">
    <div className="cube-face face-front">N</div>
    <div className="cube-face face-back">Q</div>
    <div className="cube-face face-right">M</div>
    <div className="cube-face face-left">U</div>
    <div className="cube-face face-top">I</div>
    <div className="cube-face face-bottom">B</div>
  </div>
</div>
        <h1 className="home-title">Numiqube</h1>
        <p className="home-motto">Math that sticks. Progress that shows.</p>
        <p className="home-sub">Practice math, earn XP, challenge friends, and level up your skills.</p>

        <div className="onboard-grid">
          <div className="onboard-card">
            <span className="oc-icon">⚡</span>
            <strong>Daily Challenges</strong>
            <span>New questions every day</span>
          </div>
          <div className="onboard-card">
            <span className="oc-icon">⚔️</span>
            <strong>Duel Friends</strong>
            <span>Real-time math battles</span>
          </div>
          <div className="onboard-card">
            <span className="oc-icon">📈</span>
            <strong>Track Progress</strong>
            <span>XP, streaks & ranks</span>
          </div>
          <div className="onboard-card">
            <span className="oc-icon">🧠</span>
            <strong>Smart Practice</strong>
            <span>Adapts to your level</span>
          </div>
        </div>

        <div className="home-btns">
          <button className="btn-primary" onClick={() => setMode('signup')}>
            Get Started 🚀
          </button>
          <button className="btn-secondary" onClick={() => setMode('login')}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home

