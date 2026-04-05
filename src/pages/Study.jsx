import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { useSound } from '../hooks/useSound'
import '../styles/Study.css'

const allQuestions = [
  // ─── ALGEBRA EASY ───
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve for x: 2x + 4 = 10', options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'], answer: 'x = 3', explanation: 'Subtract 4 from both sides: 2x = 6, then divide by 2: x = 3.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve for x: x - 7 = 12', options: ['x = 5', 'x = 19', 'x = 17', 'x = 21'], answer: 'x = 19', explanation: 'Add 7 to both sides: x = 19.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve for x: 3x = 21', options: ['x = 6', 'x = 7', 'x = 8', 'x = 9'], answer: 'x = 7', explanation: 'Divide both sides by 3: x = 7.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve for x: x/4 = 5', options: ['x = 1', 'x = 9', 'x = 20', 'x = 25'], answer: 'x = 20', explanation: 'Multiply both sides by 4: x = 20.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'What is the value of 3x when x = 5?', options: ['8', '10', '15', '20'], answer: '15', explanation: '3 × 5 = 15.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve: 5x - 5 = 20', options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], answer: 'x = 5', explanation: 'Add 5: 5x = 25, divide by 5: x = 5.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'If y = 2x + 1 and x = 3, what is y?', options: ['5', '6', '7', '8'], answer: '7', explanation: 'y = 2(3) + 1 = 6 + 1 = 7.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve: x + x + x = 18', options: ['x = 4', 'x = 5', 'x = 6', 'x = 9'], answer: 'x = 6', explanation: '3x = 18, so x = 6.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Expand: (x + 3)(x - 2)', options: ['x² + x - 6', 'x² - x - 6', 'x² + 5x - 6', 'x² - 6'], answer: 'x² + x - 6', explanation: 'FOIL: x² - 2x + 3x - 6 = x² + x - 6.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Solve: 2x + 3 = x - 5', options: ['x = -8', 'x = -2', 'x = 2', 'x = 8'], answer: 'x = -8', explanation: 'Subtract x: x + 3 = -5, subtract 3: x = -8.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Factor: x² - 9', options: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-3)²', '(x+9)(x-1)'], answer: '(x-3)(x+3)', explanation: 'Difference of squares: a² - b² = (a-b)(a+b).' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Solve: 3(x + 2) = 18', options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'], answer: 'x = 4', explanation: 'Expand: 3x + 6 = 18, subtract 6: 3x = 12, divide: x = 4.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'What is the slope of y = 3x + 7?', options: ['7', '3', '-3', '1/3'], answer: '3', explanation: 'In y = mx + b, m is the slope. Here m = 3.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Solve: x² = 49', options: ['x = 7', 'x = -7', 'x = ±7', 'x = 49'], answer: 'x = ±7', explanation: 'Square root both sides: x = ±7.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Simplify: 4x + 2x - x', options: ['5x', '6x', '7x', '4x'], answer: '5x', explanation: '4x + 2x - x = 6x - x = 5x.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'If f(x) = x² + 1, what is f(3)?', options: ['7', '8', '9', '10'], answer: '10', explanation: 'f(3) = 3² + 1 = 9 + 1 = 10.' },
  { topic: 'Algebra', difficulty: 'hard', question: 'Solve: x² - 5x + 6 = 0', options: ['x = 2, 3', 'x = -2, -3', 'x = 1, 6', 'x = -1, -6'], answer: 'x = 2, 3', explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3.' },
  { topic: 'Algebra', difficulty: 'hard', question: 'Solve: 2x² - 8 = 0', options: ['x = ±2', 'x = ±4', 'x = 2', 'x = 4'], answer: 'x = ±2', explanation: '2x² = 8, x² = 4, x = ±2.' },
  { topic: 'Algebra', difficulty: 'hard', question: 'What is the discriminant of x² - 4x + 4?', options: ['0', '4', '-4', '8'], answer: '0', explanation: 'b² - 4ac = 16 - 16 = 0, meaning one repeated root.' },
  { topic: 'Algebra', difficulty: 'hard', question: 'Solve the system: x + y = 7, x - y = 3', options: ['x=5, y=2', 'x=4, y=3', 'x=3, y=4', 'x=2, y=5'], answer: 'x=5, y=2', explanation: 'Add equations: 2x = 10, x = 5. Then y = 7 - 5 = 2.' },

  // ─── GEOMETRY ───
  { topic: 'Geometry', difficulty: 'easy', question: 'What is the area of a rectangle with length 8 and width 5?', options: ['13', '26', '40', '45'], answer: '40', explanation: 'Area = length × width = 8 × 5 = 40.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What is the perimeter of a square with side 6?', options: ['12', '24', '36', '30'], answer: '24', explanation: 'Perimeter = 4 × side = 4 × 6 = 24.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'A triangle has angles 90° and 45°. What is the third angle?', options: ['30°', '45°', '60°', '90°'], answer: '45°', explanation: 'Angles sum to 180°: 180 - 90 - 45 = 45°.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What is the area of a circle with radius 5?', options: ['25π', '10π', '5π', '20π'], answer: '25π', explanation: 'Area = πr² = π(25) = 25π.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'How many degrees are in a straight line?', options: ['90°', '180°', '270°', '360°'], answer: '180°', explanation: 'A straight line forms a straight angle of 180°.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What is the circumference of a circle with radius 7?', options: ['7π', '14π', '21π', '49π'], answer: '14π', explanation: 'Circumference = 2πr = 2π(7) = 14π.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What is the area of a triangle with base 10 and height 6?', options: ['30', '60', '16', '45'], answer: '30', explanation: 'Area = ½ × base × height = ½ × 10 × 6 = 30.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'A right triangle has legs 3 and 4. What is the hypotenuse?', options: ['5', '6', '7', '8'], answer: '5', explanation: 'Pythagorean theorem: 3² + 4² = 9 + 16 = 25, √25 = 5.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'What is the volume of a cube with side 4?', options: ['16', '48', '64', '96'], answer: '64', explanation: 'Volume = side³ = 4³ = 64.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'What is the surface area of a cube with side 3?', options: ['27', '36', '54', '72'], answer: '54', explanation: 'Surface area = 6 × side² = 6 × 9 = 54.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'Two angles are supplementary. One is 70°. What is the other?', options: ['20°', '110°', '120°', '290°'], answer: '110°', explanation: 'Supplementary angles sum to 180°: 180 - 70 = 110°.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'What is the volume of a cylinder with radius 3 and height 5?', options: ['15π', '30π', '45π', '90π'], answer: '45π', explanation: 'Volume = πr²h = π(9)(5) = 45π.' },
  { topic: 'Geometry', difficulty: 'hard', question: 'A cone has radius 3 and height 4. What is its volume?', options: ['12π', '36π', '48π', '9π'], answer: '12π', explanation: 'Volume = ⅓πr²h = ⅓π(9)(4) = 12π.' },
  { topic: 'Geometry', difficulty: 'hard', question: 'What is the diagonal of a rectangle with sides 5 and 12?', options: ['13', '17', '11', '15'], answer: '13', explanation: 'Diagonal = √(5² + 12²) = √(25 + 144) = √169 = 13.' },

  // ─── ARITHMETIC ───
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], answer: '30', explanation: '15% of 200 = 0.15 × 200 = 30.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 12 × 12?', options: ['124', '134', '144', '154'], answer: '144', explanation: '12 × 12 = 144.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 25% of 80?', options: ['15', '20', '25', '30'], answer: '20', explanation: '25% = ¼, so ¼ × 80 = 20.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is the LCM of 4 and 6?', options: ['8', '10', '12', '24'], answer: '12', explanation: 'Multiples of 4: 4,8,12... Multiples of 6: 6,12... LCM = 12.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is √64?', options: ['6', '7', '8', '9'], answer: '8', explanation: '8 × 8 = 64, so √64 = 8.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 2⁵?', options: ['10', '16', '32', '64'], answer: '32', explanation: '2⁵ = 2 × 2 × 2 × 2 × 2 = 32.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is the GCF of 12 and 18?', options: ['2', '3', '6', '9'], answer: '6', explanation: 'Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. GCF = 6.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 3³?', options: ['9', '18', '27', '81'], answer: '27', explanation: '3³ = 3 × 3 × 3 = 27.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is 17% of 300?', options: ['41', '51', '61', '71'], answer: '51', explanation: '0.17 × 300 = 51.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'Simplify: 48/64', options: ['2/3', '3/4', '4/5', '5/6'], answer: '3/4', explanation: 'GCF of 48 and 64 is 16. 48/16 = 3, 64/16 = 4. So 3/4.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is 0.35 as a fraction?', options: ['1/3', '7/20', '3/8', '2/5'], answer: '7/20', explanation: '0.35 = 35/100 = 7/20.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is 2/3 + 3/4?', options: ['5/7', '17/12', '5/12', '6/7'], answer: '17/12', explanation: 'Common denominator 12: 8/12 + 9/12 = 17/12.' },
  { topic: 'Arithmetic', difficulty: 'hard', question: 'What is 2/5 ÷ 4/15?', options: ['3/2', '8/75', '2/3', '15/8'], answer: '3/2', explanation: 'Multiply by reciprocal: 2/5 × 15/4 = 30/20 = 3/2.' },
  { topic: 'Arithmetic', difficulty: 'hard', question: 'What is 12.5% of 480?', options: ['48', '54', '60', '72'], answer: '60', explanation: '12.5% = 1/8, so 480/8 = 60.' },

  // ─── STATISTICS ───
  { topic: 'Statistics', difficulty: 'easy', question: 'What is the mean of 4, 8, 6, 10, 2?', options: ['5', '6', '7', '8'], answer: '6', explanation: '(4+8+6+10+2)/5 = 30/5 = 6.' },
  { topic: 'Statistics', difficulty: 'easy', question: 'What is the median of 3, 7, 1, 9, 5?', options: ['3', '5', '7', '9'], answer: '5', explanation: 'Ordered: 1,3,5,7,9. Middle value is 5.' },
  { topic: 'Statistics', difficulty: 'easy', question: 'What is the mode of 2, 3, 3, 5, 7, 3?', options: ['2', '3', '5', '7'], answer: '3', explanation: '3 appears most often (3 times).' },
  { topic: 'Statistics', difficulty: 'easy', question: 'What is the range of 5, 12, 3, 8, 15?', options: ['10', '11', '12', '13'], answer: '12', explanation: 'Range = max - min = 15 - 3 = 12.' },
  { topic: 'Statistics', difficulty: 'medium', question: 'A bag has 3 red, 2 blue, 5 green balls. What is P(red)?', options: ['1/5', '3/10', '1/3', '2/5'], answer: '3/10', explanation: '3 red out of 10 total = 3/10.' },
  { topic: 'Statistics', difficulty: 'medium', question: 'What is the mean of 10, 20, 30, 40, 50?', options: ['25', '30', '35', '40'], answer: '30', explanation: '(10+20+30+40+50)/5 = 150/5 = 30.' },
  { topic: 'Statistics', difficulty: 'medium', question: 'If P(A) = 0.4, what is P(not A)?', options: ['0.4', '0.5', '0.6', '0.8'], answer: '0.6', explanation: 'P(not A) = 1 - P(A) = 1 - 0.4 = 0.6.' },

  // ─── CALCULUS ───
  { topic: 'Calculus', difficulty: 'easy', question: 'What is the derivative of x²?', options: ['x', '2x', '2', 'x²'], answer: '2x', explanation: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x.' },
  { topic: 'Calculus', difficulty: 'easy', question: 'What is the derivative of 5x?', options: ['5x', '5', 'x', '0'], answer: '5', explanation: 'The derivative of a constant times x is just the constant.' },
  { topic: 'Calculus', difficulty: 'easy', question: 'What is the derivative of a constant?', options: ['1', 'The constant', '0', 'undefined'], answer: '0', explanation: 'Constants have no rate of change, so their derivative is 0.' },
  { topic: 'Calculus', difficulty: 'medium', question: 'What is the derivative of x³ + 2x?', options: ['3x + 2', '3x² + 2', 'x² + 2', '3x²'], answer: '3x² + 2', explanation: 'd/dx(x³) = 3x², d/dx(2x) = 2. Total: 3x² + 2.' },
  { topic: 'Calculus', difficulty: 'medium', question: 'What is ∫2x dx?', options: ['x', 'x² + C', '2x² + C', '2 + C'], answer: 'x² + C', explanation: '∫2x dx = 2 × x²/2 + C = x² + C.' },
  { topic: 'Calculus', difficulty: 'medium', question: 'What is the derivative of sin(x)?', options: ['-sin(x)', 'cos(x)', '-cos(x)', 'tan(x)'], answer: 'cos(x)', explanation: 'The derivative of sin(x) is cos(x).' },
  { topic: 'Calculus', difficulty: 'hard', question: 'What is the derivative of e^x?', options: ['xe^x', 'e^x', 'e^(x-1)', '1'], answer: 'e^x', explanation: 'e^x is its own derivative — a unique property of e.' },
  { topic: 'Calculus', difficulty: 'hard', question: 'What is ∫x² dx?', options: ['2x + C', 'x³ + C', 'x³/3 + C', '3x³ + C'], answer: 'x³/3 + C', explanation: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C. So ∫x² dx = x³/3 + C.' },
]

const TOPICS = ['All', 'Algebra', 'Geometry', 'Arithmetic', 'Statistics', 'Calculus']
const DIFFICULTIES = ['All', 'easy', 'medium', 'hard']

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function Study() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, updateProfile, recordStudyDay } = useProfile(user)
  const { playCorrect, playWrong } = useSound()

  const [selectedTopic, setSelectedTopic] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [questions, setQuestions] = useState(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [started, setStarted] = useState(false)

  function startSession() {
    let filtered = allQuestions
    if (selectedTopic !== 'All') filtered = filtered.filter(q => q.topic === selectedTopic)
    if (selectedDifficulty !== 'All') filtered = filtered.filter(q => q.difficulty === selectedDifficulty)
    if (filtered.length === 0) return
    setQuestions(shuffle(filtered).slice(0, 10))
    setStarted(true)
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setXpGained(0)
    setFinished(false)
  }

  async function handleAnswer(option) {
    if (selected) return
    setSelected(option)
    if (option === questions[current].answer) {
      playCorrect()
      const gained = selectedDifficulty === 'hard' ? 30 : selectedDifficulty === 'medium' ? 20 : 10
      setScore(s => s + 1)
      setXpGained(x => x + gained)
      await updateProfile({
        xp: (profile?.xp ?? 0) + gained,
        solved: (profile?.solved ?? 0) + 1
      })
    } else {
      playWrong()
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      recordStudyDay({ xp: xpGained, solved: score, studyTime: questions.length })
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  // Topic/difficulty selector screen
  if (!started) {
    return (
      <div className="study">
        <div className="study-container">
          <div className="study-header">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
            <h2 className="study-pick-title">📚 Study</h2>
          </div>

          <p className="section-title">Choose Topic</p>
          <div className="topic-grid">
            {TOPICS.map(t => (
              <button
                key={t}
                className={`topic-btn ${selectedTopic === t ? 'active' : ''}`}
                onClick={() => setSelectedTopic(t)}
              >
                {t === 'All' ? '🌐' : t === 'Algebra' ? '📐' : t === 'Geometry' ? '📏' : t === 'Arithmetic' ? '🔢' : t === 'Statistics' ? '📊' : '∫'} {t}
              </button>
            ))}
          </div>

          <p className="section-title">Choose Difficulty</p>
          <div className="diff-grid">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                className={`diff-btn ${selectedDifficulty === d ? 'active' : ''} ${d !== 'All' ? `d-${d}` : ''}`}
                onClick={() => setSelectedDifficulty(d)}
              >
                {d === 'All' ? '🎯 All' : d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Medium' : '🔴 Hard'}
              </button>
            ))}
          </div>

          <div className="start-info">
            <p>
              <strong>{
                allQuestions.filter(q =>
                  (selectedTopic === 'All' || q.topic === selectedTopic) &&
                  (selectedDifficulty === 'All' || q.difficulty === selectedDifficulty)
                ).length
              }</strong> questions available
            </p>
          </div>

          <button className="btn-primary" onClick={startSession}>
            Start Session 🚀
          </button>
        </div>
      </div>
    )
  }

  // Finished screen
  if (finished) {
    return (
      <div className="study">
        <div className="result-card">
          <span className="result-icon">🎉</span>
          <h2>Session Complete!</h2>
          <p className="result-score">{score}/{questions.length} correct</p>
          <p className="result-xp">+{xpGained} XP earned!</p>
          <button className="btn-primary" onClick={startSession}>Play Again</button>
          <button className="btn-secondary" onClick={() => { setStarted(false) }}>
            Change Topic
          </button>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  return (
    <div className="study">
      <div className="study-container">
        <div className="study-header">
          <button className="btn-secondary" onClick={() => setStarted(false)}>← Back</button>
          <div className="study-score">⚡ {xpGained} XP</div>
        </div>

        <div className="progress-wrap">
          <div className="progress-bar" style={{ width: `${(current / questions.length) * 100}%` }}></div>
        </div>
        <p className="q-counter">Question {current + 1} of {questions.length}</p>

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