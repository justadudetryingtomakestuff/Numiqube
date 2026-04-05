import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { useSound } from '../hooks/useSound'
import '../styles/Study.css'
import MathText from '../components/MathText'

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
  // ─── ALGEBRA EASY (more) ───
  { topic: 'Algebra', difficulty: 'easy', question: 'What is the value of 2x + 3 when x = 4?', options: ['8', '10', '11', '14'], answer: '11', explanation: '2(4) + 3 = 8 + 3 = 11.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve: 4x = 32', options: ['x = 6', 'x = 7', 'x = 8', 'x = 9'], answer: 'x = 8', explanation: 'Divide both sides by 4: x = 8.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'If x = 3, what is x² + x?', options: ['9', '10', '11', '12'], answer: '12', explanation: '3² + 3 = 9 + 3 = 12.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve: x + 15 = 30', options: ['x = 10', 'x = 12', 'x = 15', 'x = 20'], answer: 'x = 15', explanation: 'Subtract 15: x = 15.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'What is 5 - 2x when x = 1?', options: ['1', '2', '3', '4'], answer: '3', explanation: '5 - 2(1) = 5 - 2 = 3.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve: 2x = 0', options: ['x = 0', 'x = 1', 'x = 2', 'x = -1'], answer: 'x = 0', explanation: 'Divide both sides by 2: x = 0.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'What is the coefficient of x in 7x + 3?', options: ['3', '7', '10', '21'], answer: '7', explanation: 'The coefficient is the number multiplied by x, which is 7.' },
  { topic: 'Algebra', difficulty: 'easy', question: 'Solve: x - 9 = 0', options: ['x = 0', 'x = 3', 'x = 9', 'x = 81'], answer: 'x = 9', explanation: 'Add 9 to both sides: x = 9.' },

  // ─── ALGEBRA MEDIUM (more) ───
  { topic: 'Algebra', difficulty: 'medium', question: 'What is the y-intercept of y = 4x - 7?', options: ['-7', '4', '7', '-4'], answer: '-7', explanation: 'In y = mx + b, b is the y-intercept. Here b = -7.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Solve: 2(x - 3) = 10', options: ['x = 5', 'x = 6', 'x = 7', 'x = 8'], answer: 'x = 8', explanation: 'Divide by 2: x - 3 = 5, then add 3: x = 8.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Factor: x² + 5x + 6', options: ['(x+2)(x+3)', '(x+1)(x+6)', '(x-2)(x-3)', '(x+6)(x-1)'], answer: '(x+2)(x+3)', explanation: 'Find two numbers that multiply to 6 and add to 5: 2 and 3.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'What is the slope of the line through (0,0) and (4,8)?', options: ['1', '2', '4', '8'], answer: '2', explanation: 'Slope = (8-0)/(4-0) = 8/4 = 2.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Solve: 3x - 7 = 2x + 5', options: ['x = 10', 'x = 11', 'x = 12', 'x = 13'], answer: 'x = 12', explanation: 'Subtract 2x: x - 7 = 5, add 7: x = 12.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'What is f(-2) if f(x) = x² - 3?', options: ['1', '-7', '-1', '7'], answer: '1', explanation: 'f(-2) = (-2)² - 3 = 4 - 3 = 1.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Simplify: (3x²)(2x³)', options: ['5x⁵', '6x⁵', '6x⁶', '5x⁶'], answer: '6x⁵', explanation: 'Multiply coefficients: 3×2=6. Add exponents: 2+3=5. Result: 6x⁵.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'Solve: |x| = 5', options: ['x = 5', 'x = -5', 'x = ±5', 'x = 25'], answer: 'x = ±5', explanation: 'Absolute value means x can be 5 or -5.' },
  { topic: 'Algebra', difficulty: 'medium', question: 'What is the vertex x-coordinate of y = x² - 6x + 9?', options: ['x = 3', 'x = -3', 'x = 6', 'x = 9'], answer: 'x = 3', explanation: 'Vertex x = -b/2a = 6/2 = 3.' },

  // ─── ALGEBRA HARD (more) ───
  { topic: 'Algebra', difficulty: 'hard', question: 'Solve: x² + 4x - 12 = 0', options: ['x = 2, -6', 'x = -2, 6', 'x = 3, -4', 'x = -3, 4'], answer: 'x = 2, -6', explanation: 'Factor: (x+6)(x-2) = 0, so x = -6 or x = 2.' },
  { topic: 'Algebra', difficulty: 'hard', question: 'If f(x) = 2x + 1 and g(x) = x², what is f(g(3))?', options: ['13', '18', '19', '21'], answer: '19', explanation: 'g(3) = 9, then f(9) = 2(9) + 1 = 19.' },
  { topic: 'Algebra', difficulty: 'hard', question: 'Solve: 2x² + 5x - 3 = 0', options: ['x = 0.5, -3', 'x = -0.5, 3', 'x = 1, -3', 'x = 0.5, 3'], answer: 'x = 0.5, -3', explanation: 'Factor: (2x-1)(x+3) = 0, so x = 1/2 or x = -3.' },
  { topic: 'Algebra', difficulty: 'hard', question: 'What is the sum of roots of x² - 7x + 10 = 0?', options: ['5', '7', '10', '-7'], answer: '7', explanation: 'Sum of roots = -b/a = 7/1 = 7.' },
  { topic: 'Algebra', difficulty: 'hard', question: 'Solve the system: 2x + y = 8, x - y = 1', options: ['x=3, y=2', 'x=2, y=4', 'x=4, y=0', 'x=3, y=3'], answer: 'x=3, y=2', explanation: 'Add equations: 3x = 9, x = 3. Then y = 8 - 6 = 2.' },

  // ─── GEOMETRY EASY (more) ───
  { topic: 'Geometry', difficulty: 'easy', question: 'What is the perimeter of a rectangle with length 10 and width 4?', options: ['14', '20', '28', '40'], answer: '28', explanation: 'Perimeter = 2(l + w) = 2(10 + 4) = 28.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'How many sides does a hexagon have?', options: ['4', '5', '6', '7'], answer: '6', explanation: 'A hexagon has 6 sides.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What type of angle is 90°?', options: ['Acute', 'Right', 'Obtuse', 'Straight'], answer: 'Right', explanation: 'A 90° angle is called a right angle.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What is the area of a square with side 9?', options: ['36', '72', '81', '18'], answer: '81', explanation: 'Area = side² = 9² = 81.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'How many degrees in a full circle?', options: ['180°', '270°', '360°', '90°'], answer: '360°', explanation: 'A full rotation is 360°.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What is an angle less than 90° called?', options: ['Obtuse', 'Right', 'Straight', 'Acute'], answer: 'Acute', explanation: 'Angles less than 90° are called acute angles.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What is the perimeter of an equilateral triangle with side 7?', options: ['14', '21', '28', '49'], answer: '21', explanation: 'Perimeter = 3 × side = 3 × 7 = 21.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What is the radius if the diameter is 18?', options: ['6', '9', '12', '36'], answer: '9', explanation: 'Radius = diameter / 2 = 18 / 2 = 9.' },
  { topic: 'Geometry', difficulty: 'easy', question: 'What do angles in a triangle sum to?', options: ['90°', '180°', '270°', '360°'], answer: '180°', explanation: 'The interior angles of any triangle always sum to 180°.' },

  // ─── GEOMETRY MEDIUM (more) ───
  { topic: 'Geometry', difficulty: 'medium', question: 'What is the area of a circle with diameter 10?', options: ['10π', '20π', '25π', '100π'], answer: '25π', explanation: 'Radius = 5, Area = π(5²) = 25π.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'A right triangle has hypotenuse 13 and one leg 5. Find the other leg.', options: ['8', '10', '11', '12'], answer: '12', explanation: '5² + b² = 13², so b² = 169 - 25 = 144, b = 12.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'What is the volume of a rectangular prism 4×5×6?', options: ['60', '74', '120', '240'], answer: '120', explanation: 'Volume = l × w × h = 4 × 5 × 6 = 120.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'Two parallel lines are cut by a transversal. Alternate interior angles are...', options: ['Supplementary', 'Complementary', 'Equal', 'Different'], answer: 'Equal', explanation: 'Alternate interior angles formed by parallel lines are always equal.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'What is the area of a trapezoid with bases 6, 10 and height 4?', options: ['24', '32', '40', '48'], answer: '32', explanation: 'Area = ½(b1 + b2)h = ½(6 + 10)(4) = 32.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'What is the volume of a sphere with radius 3?', options: ['12π', '36π', '108π', '27π'], answer: '36π', explanation: 'Volume = (4/3)πr³ = (4/3)π(27) = 36π.' },
  { topic: 'Geometry', difficulty: 'medium', question: 'What is the sum of interior angles of a pentagon?', options: ['360°', '450°', '540°', '720°'], answer: '540°', explanation: 'Sum = (n-2) × 180 = (5-2) × 180 = 540°.' },

  // ─── GEOMETRY HARD (more) ───
  { topic: 'Geometry', difficulty: 'hard', question: 'What is the surface area of a sphere with radius 4?', options: ['16π', '32π', '48π', '64π'], answer: '64π', explanation: 'Surface area = 4πr² = 4π(16) = 64π.' },
  { topic: 'Geometry', difficulty: 'hard', question: 'A cylinder has radius 5 and height 8. What is its total surface area?', options: ['40π', '80π', '130π', '160π'], answer: '130π', explanation: 'TSA = 2πr² + 2πrh = 2π(25) + 2π(5)(8) = 50π + 80π = 130π.' },
  { topic: 'Geometry', difficulty: 'hard', question: 'What is the sum of interior angles of an octagon?', options: ['900°', '1080°', '1260°', '1440°'], answer: '1080°', explanation: 'Sum = (n-2) × 180 = (8-2) × 180 = 1080°.' },
  { topic: 'Geometry', difficulty: 'hard', question: 'A regular hexagon has side 6. What is its area?', options: ['54√3', '72√3', '54', '108'], answer: '54√3', explanation: 'Area = (3√3/2)s² = (3√3/2)(36) = 54√3.' },

  // ─── ARITHMETIC EASY (more) ───
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 144 ÷ 12?', options: ['10', '11', '12', '13'], answer: '12', explanation: '144 ÷ 12 = 12.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 7 × 8?', options: ['48', '54', '56', '64'], answer: '56', explanation: '7 × 8 = 56.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 50% of 90?', options: ['40', '45', '50', '55'], answer: '45', explanation: '50% = half, so 90 ÷ 2 = 45.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is √121?', options: ['9', '10', '11', '12'], answer: '11', explanation: '11 × 11 = 121, so √121 = 11.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 4⁴?', options: ['16', '64', '128', '256'], answer: '256', explanation: '4⁴ = 4 × 4 × 4 × 4 = 256.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is the LCM of 3 and 5?', options: ['8', '10', '15', '20'], answer: '15', explanation: 'Multiples of 3: 3,6,9,12,15. Multiples of 5: 5,10,15. LCM = 15.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 1000 - 437?', options: ['553', '563', '573', '583'], answer: '563', explanation: '1000 - 437 = 563.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 75% of 200?', options: ['100', '125', '150', '175'], answer: '150', explanation: '75% = 3/4, so 3/4 × 200 = 150.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'What is 9²?', options: ['18', '27', '72', '81'], answer: '81', explanation: '9² = 9 × 9 = 81.' },
  { topic: 'Arithmetic', difficulty: 'easy', question: 'Which is largest: 3/4, 2/3, 5/8?', options: ['2/3', '5/8', '3/4', 'They are equal'], answer: '3/4', explanation: '3/4 = 0.75, 2/3 ≈ 0.667, 5/8 = 0.625. So 3/4 is largest.' },

  // ─── ARITHMETIC MEDIUM (more) ───
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is 3/8 as a decimal?', options: ['0.325', '0.375', '0.38', '0.4'], answer: '0.375', explanation: '3 ÷ 8 = 0.375.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is 45% of 360?', options: ['144', '154', '162', '172'], answer: '162', explanation: '0.45 × 360 = 162.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is 5/6 - 1/4?', options: ['4/10', '7/12', '2/3', '1/2'], answer: '7/12', explanation: 'LCD = 12: 10/12 - 3/12 = 7/12.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is the GCF of 36 and 48?', options: ['6', '8', '12', '16'], answer: '12', explanation: 'Factors of 36: 1,2,3,4,6,9,12,18,36. Factors of 48: 1,2,3,4,6,8,12,16,24,48. GCF = 12.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is 2.5 × 1.4?', options: ['2.5', '3', '3.5', '4'], answer: '3.5', explanation: '2.5 × 1.4 = 3.5.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'A shirt costs $40 and is 20% off. What is the sale price?', options: ['$28', '$30', '$32', '$38'], answer: '$32', explanation: '20% of 40 = 8. 40 - 8 = $32.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is 3/5 × 10/9?', options: ['1/3', '2/3', '5/6', '1/2'], answer: '2/3', explanation: '(3×10)/(5×9) = 30/45 = 2/3.' },
  { topic: 'Arithmetic', difficulty: 'medium', question: 'What is 125% of 80?', options: ['90', '95', '100', '110'], answer: '100', explanation: '125% = 1.25, 1.25 × 80 = 100.' },

  // ─── ARITHMETIC HARD (more) ───
  { topic: 'Arithmetic', difficulty: 'hard', question: 'What is 3⁻² as a fraction?', options: ['1/6', '1/9', '1/3', '-9'], answer: '1/9', explanation: '3⁻² = 1/3² = 1/9.' },
  { topic: 'Arithmetic', difficulty: 'hard', question: 'What is √(16/25)?', options: ['4/5', '2/5', '4/25', '8/25'], answer: '4/5', explanation: '√16/√25 = 4/5.' },
  { topic: 'Arithmetic', difficulty: 'hard', question: 'A car travels 240 miles in 4 hours. What is its speed in mph?', options: ['50', '55', '60', '65'], answer: '60', explanation: 'Speed = distance/time = 240/4 = 60 mph.' },
  { topic: 'Arithmetic', difficulty: 'hard', question: 'What is 2/3 of 3/4 of 120?', options: ['50', '55', '60', '65'], answer: '60', explanation: '3/4 of 120 = 90, 2/3 of 90 = 60.' },

  // ─── STATISTICS EASY (more) ───
  { topic: 'Statistics', difficulty: 'easy', question: 'What is the mean of 10, 20, 30?', options: ['15', '20', '25', '30'], answer: '20', explanation: '(10 + 20 + 30) / 3 = 60 / 3 = 20.' },
  { topic: 'Statistics', difficulty: 'easy', question: 'What is the median of 1, 3, 5, 7, 9?', options: ['3', '4', '5', '7'], answer: '5', explanation: 'The middle value of 5 numbers is the 3rd one: 5.' },
  { topic: 'Statistics', difficulty: 'easy', question: 'A die is rolled. What is P(even number)?', options: ['1/6', '1/3', '1/2', '2/3'], answer: '1/2', explanation: 'Even numbers: 2,4,6 = 3 out of 6. P = 3/6 = 1/2.' },
  { topic: 'Statistics', difficulty: 'easy', question: 'What is the range of 8, 3, 12, 5, 9?', options: ['7', '8', '9', '10'], answer: '9', explanation: 'Range = max - min = 12 - 3 = 9.' },
  { topic: 'Statistics', difficulty: 'easy', question: 'In a class of 30, 12 are boys. What fraction are girls?', options: ['2/5', '3/5', '12/30', '1/2'], answer: '3/5', explanation: '30 - 12 = 18 girls. 18/30 = 3/5.' },
  { topic: 'Statistics', difficulty: 'easy', question: 'What is the mode of 4, 7, 4, 9, 2, 7, 4?', options: ['2', '4', '7', '9'], answer: '4', explanation: '4 appears 3 times, more than any other number.' },

  // ─── STATISTICS MEDIUM (more) ───
  { topic: 'Statistics', difficulty: 'medium', question: 'Two dice are rolled. What is P(sum = 7)?', options: ['1/6', '5/36', '6/36', '7/36'], answer: '6/36', explanation: 'Pairs that sum to 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 pairs out of 36.' },
  { topic: 'Statistics', difficulty: 'medium', question: 'What is the mean of 15, 22, 18, 25, 20?', options: ['18', '19', '20', '21'], answer: '20', explanation: '(15+22+18+25+20)/5 = 100/5 = 20.' },
  { topic: 'Statistics', difficulty: 'medium', question: 'A card is drawn from a standard deck. P(King)?', options: ['1/13', '4/52', '1/4', '4/13'], answer: '1/13', explanation: '4 Kings out of 52 cards = 4/52 = 1/13.' },
  { topic: 'Statistics', difficulty: 'medium', question: 'What is the median of 2, 5, 8, 11?', options: ['5', '6', '6.5', '8'], answer: '6.5', explanation: 'Even number of values: average middle two = (5+8)/2 = 6.5.' },
  { topic: 'Statistics', difficulty: 'medium', question: 'If P(A) = 0.3 and P(B) = 0.5 and they are independent, what is P(A and B)?', options: ['0.15', '0.2', '0.35', '0.8'], answer: '0.15', explanation: 'P(A and B) = P(A) × P(B) = 0.3 × 0.5 = 0.15.' },

  // ─── STATISTICS HARD (more) ───
  { topic: 'Statistics', difficulty: 'hard', question: 'A bag has 5 red and 3 blue. Two drawn without replacement. P(both red)?', options: ['5/14', '25/64', '10/21', '5/16'], answer: '5/14', explanation: 'P = (5/8) × (4/7) = 20/56 = 5/14.' },
  { topic: 'Statistics', difficulty: 'hard', question: 'What is the variance of 2, 4, 6?', options: ['2', '4/3', '8/3', '4'], answer: '8/3', explanation: 'Mean = 4. Variance = [(2-4)² + (4-4)² + (6-4)²]/3 = (4+0+4)/3 = 8/3.' },
  { topic: 'Statistics', difficulty: 'hard', question: 'How many ways can 5 people sit in a row?', options: ['25', '60', '120', '720'], answer: '120', explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120.' },

  // ─── CALCULUS EASY (more) ───
  { topic: 'Calculus', difficulty: 'easy', question: 'What is the derivative of x⁴?', options: ['4x', '4x²', '4x³', 'x³'], answer: '4x³', explanation: 'Power rule: d/dx(x⁴) = 4x³.' },
  { topic: 'Calculus', difficulty: 'easy', question: 'What is the derivative of 3x² + 2x?', options: ['3x + 2', '6x + 2', '6x', '3x² + 2'], answer: '6x + 2', explanation: 'd/dx(3x²) = 6x, d/dx(2x) = 2. Total: 6x + 2.' },
  { topic: 'Calculus', difficulty: 'easy', question: 'What is the derivative of cos(x)?', options: ['sin(x)', '-sin(x)', 'cos(x)', '-cos(x)'], answer: '-sin(x)', explanation: 'The derivative of cos(x) is -sin(x).' },
  { topic: 'Calculus', difficulty: 'easy', question: 'What is ∫3 dx?', options: ['0', '3', '3x + C', '3x'], answer: '3x + C', explanation: 'The integral of a constant k is kx + C.' },
  { topic: 'Calculus', difficulty: 'easy', question: 'What is the derivative of ln(x)?', options: ['1/x', 'x', 'e^x', 'ln(x)/x'], answer: '1/x', explanation: 'd/dx(ln x) = 1/x.' },

  // ─── CALCULUS MEDIUM (more) ───
  { topic: 'Calculus', difficulty: 'medium', question: 'What is ∫x³ dx?', options: ['3x²', 'x⁴ + C', 'x⁴/4 + C', '4x³ + C'], answer: 'x⁴/4 + C', explanation: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C = x⁴/4 + C.' },
  { topic: 'Calculus', difficulty: 'medium', question: 'What is the derivative of sin(x) + cos(x)?', options: ['cos(x) + sin(x)', 'cos(x) - sin(x)', '-cos(x) + sin(x)', '-sin(x) - cos(x)'], answer: 'cos(x) - sin(x)', explanation: 'd/dx(sin x) = cos x, d/dx(cos x) = -sin x. Total: cos(x) - sin(x).' },
  { topic: 'Calculus', difficulty: 'medium', question: 'What is the second derivative of x³?', options: ['3x', '3x²', '6x', '6'], answer: '6x', explanation: 'First: 3x². Second: 6x.' },
  { topic: 'Calculus', difficulty: 'medium', question: 'Evaluate: ∫₀² x dx', options: ['1', '2', '3', '4'], answer: '2', explanation: '[x²/2]₀² = 4/2 - 0 = 2.' },
  { topic: 'Calculus', difficulty: 'medium', question: 'What is the derivative of x² · sin(x) using product rule?', options: ['2x·sin(x)', 'x²·cos(x)', '2x·sin(x) + x²·cos(x)', '2x·cos(x)'], answer: '2x·sin(x) + x²·cos(x)', explanation: 'Product rule: f\'g + fg\' = 2x·sin(x) + x²·cos(x).' },
  { topic: 'Calculus', difficulty: 'medium', question: 'At what x does f(x) = x² - 4x have a minimum?', options: ['x = 0', 'x = 2', 'x = 4', 'x = -2'], answer: 'x = 2', explanation: 'f\'(x) = 2x - 4 = 0, so x = 2.' },

  // ─── CALCULUS HARD (more) ───
  { topic: 'Calculus', difficulty: 'hard', question: 'What is the derivative of e^(2x)?', options: ['e^(2x)', '2e^(2x)', 'e^(2x)/2', '2xe^x'], answer: '2e^(2x)', explanation: 'Chain rule: derivative of e^(2x) = 2e^(2x).' },
  { topic: 'Calculus', difficulty: 'hard', question: 'Evaluate: ∫₀¹ x² dx', options: ['1/4', '1/3', '1/2', '1'], answer: '1/3', explanation: '[x³/3]₀¹ = 1/3 - 0 = 1/3.' },
  { topic: 'Calculus', difficulty: 'hard', question: 'What is lim(x→0) sin(x)/x?', options: ['0', '1', 'undefined', '∞'], answer: '1', explanation: 'This is a standard limit: lim(x→0) sin(x)/x = 1.' },
  { topic: 'Calculus', difficulty: 'hard', question: 'What is the derivative of tan(x)?', options: ['sin(x)', 'cos(x)', 'sec²(x)', 'cot(x)'], answer: 'sec²(x)', explanation: 'd/dx(tan x) = sec²(x).' },
  { topic: 'Calculus', difficulty: 'hard', question: 'Using chain rule, what is d/dx[sin(x²)]?', options: ['cos(x²)', '2x·cos(x²)', 'sin(2x)', '2cos(x²)'], answer: '2x·cos(x²)', explanation: 'Chain rule: cos(x²) × 2x = 2x·cos(x²).' },
]


function shuffleOptions(question) {
  const options = [...question.options]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }
  return { ...question, options }
}

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
setQuestions(shuffle(filtered).slice(0, 10).map(q => {
  const options = [...q.options]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }
  return { ...q, options }
}))
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
   <p className="q-counter">Question {current + 1}</p>

        <div className="question-card">
          <div className={`diff-tag d-${q.difficulty}`}>{q.difficulty}</div>
          <div className="topic-badge">{q.topic}</div>
       <p className="question-text"><MathText text={q.question} /></p>

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
           <MathText text={option} />
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