import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Study.css'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { useSound } from '../hooks/useSound'

const questions = [
  {
    topic: 'Algebra',
    difficulty: 'easy',
    question: 'Solve for x: 2x + 4 = 10',
    options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
    answer: 'x = 3',
    explanation: 'Subtract 4 from both sides to get 2x = 6, then divide by 2 to get x = 3.'
  },
  {
    topic: 'Algebra',
    difficulty: 'medium',
    question: 'Expand: (x + 3)(x - 2)',
    options: ['x² + x - 6', 'x² - x - 6', 'x² + 5x - 6', 'x² - 6'],
    answer: 'x² + x - 6',
    explanation: 'Use FOIL: x² - 2x + 3x - 6 = x² + x - 6'
  },
  {
    topic: 'Geometry',
    difficulty: 'easy',
    question: 'What is the area of a circle with radius 5?',
    options: ['25π', '10π', '5π', '20π'],
    answer: '25π',
    explanation: 'Area = πr² = π(5²) = 25π'
  },
  {
    topic: 'Geometry',
    difficulty: 'medium',
    question: 'A triangle has angles 90°, 45°, and ___°',
    options: ['45°', '60°', '30°', '90°'],
    answer: '45°',
    explanation: 'Angles in a triangle add up to 180°. 180 - 90 - 45 = 45°'
  },
  {
    topic: 'Arithmetic',
    difficulty: 'easy',
    question: 'What is 15% of 200?',
    options: ['30', '25', '35', '40'],
    answer: '30',
    explanation: '15% of 200 = 0.15 × 200 = 30'
  }
]

function Study() {
  const navigate = useNavigate()
  const { user } = useAuth()
const { profile, updateProfile, recordStudyDay } = useProfile(user)
const { playCorrect, playWrong } = useSound()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  
  

  const q = questions[current]

 async function handleAnswer(option) {
  if (selected) return
  setSelected(option)
  if (option === q.answer) {
     playCorrect()  
    const gained = 20
    setScore(s => s + 1)
    setXpGained(x => x + gained)
    await updateProfile({
      xp: (profile?.xp ?? 0) + gained,
      solved: (profile?.solved ?? 0) + 1
    })
  }
}

 function handleNext() {
  if (current + 1 >= questions.length) {
recordStudyDay({ xp: xpGained, solved: score, studyTime: questions.length })
    setFinished(true)
  } else {
    playWrong()
    setCurrent(c => c + 1)
    setSelected(null)
  }
}

  return (
    <div className="study">
      <div className="study-container">

        {/* Header */}
        <div className="study-header">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
          <div className="study-score">⚡ {xpGained} XP</div>
        </div>

        {/* Progress */}
        <div className="progress-wrap">
          <div className="progress-bar" style={{ width: `${(current / questions.length) * 100}%` }}></div>
        </div>
        <p className="q-counter">Question {current + 1} of {questions.length}</p>

        {/* Question Card */}
        <div className="question-card">
          <div className={`diff-tag d-${q.difficulty}`}>{q.difficulty}</div>
          <div className="topic-badge">{q.topic}</div>
          <p className="question-text">{q.question}</p>

          <div className="options-grid">
            {q.options.map((option, i) => (
              <button
                key={i}
                className={`opt-btn
                  ${selected === option ? option === q.answer ? 'correct' : 'wrong' : ''}
                  ${selected && option === q.answer ? 'correct' : ''}
                `}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {selected && (
            <div className={`feedback ${selected === q.answer ? 'feedback-correct' : 'feedback-wrong'}`}>
              <strong>{selected === q.answer ? '✅ Correct!' : '❌ Incorrect'}</strong>
              <p>{q.explanation}</p>
              <button className="btn-primary" onClick={handleNext}>
                {current + 1 >= questions.length ? 'Finish 🎉' : 'Next →'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Study