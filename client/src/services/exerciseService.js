// Math problem generator service
const generateAlgebraProblem = (difficulty) => {
  const problems = {
    easy: [
      {
        type: 'linear',
        generate: () => {
          const a = Math.floor(Math.random() * 5) + 1;
          const b = Math.floor(Math.random() * 10) + 1;
          const c = Math.floor(Math.random() * 10) + 1;
          return {
            question: `Solve for x: ${a}x + ${b} = ${c}`,
            answer: ((c - b) / a).toString(),
            hints: [
              `Subtract ${b} from both sides`,
              `Divide both sides by ${a}`,
              `x = ${(c - b) / a}`
            ]
          };
        }
      },
      {
        type: 'quadratic',
        generate: () => {
          const a = 1;
          const b = Math.floor(Math.random() * 5) + 1;
          const c = Math.floor(Math.random() * 5) + 1;
          return {
            question: `Solve for x: x² + ${b}x + ${c} = 0`,
            answer: `x = ${-b/2} ± √(${b*b/4 - c})`,
            hints: [
              'Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a',
              `a = ${a}, b = ${b}, c = ${c}`,
              'Simplify the expression'
            ]
          };
        }
      }
    ],
    medium: [
      {
        type: 'system',
        generate: () => {
          const a = Math.floor(Math.random() * 5) + 1;
          const b = Math.floor(Math.random() * 5) + 1;
          const c = Math.floor(Math.random() * 10) + 1;
          const d = Math.floor(Math.random() * 10) + 1;
          return {
            question: `Solve the system of equations:\n${a}x + ${b}y = ${c}\n${b}x + ${a}y = ${d}`,
            answer: `x = ${(c*a - b*d)/(a*a - b*b)}, y = ${(d*a - b*c)/(a*a - b*b)}`,
            hints: [
              'Use substitution or elimination method',
              'Solve for one variable in terms of the other',
              'Substitute back to find the other variable'
            ]
          };
        }
      }
    ],
    hard: [
      {
        type: 'complex',
        generate: () => {
          const a = Math.floor(Math.random() * 5) + 1;
          const b = Math.floor(Math.random() * 5) + 1;
          const c = Math.floor(Math.random() * 5) + 1;
          return {
            question: `Solve for x: ${a}x³ + ${b}x² + ${c}x = 0`,
            answer: `x = 0, x = ${(-b + Math.sqrt(b*b - 4*a*c))/(2*a)}, x = ${(-b - Math.sqrt(b*b - 4*a*c))/(2*a)}`,
            hints: [
              'Factor out x',
              'Use the quadratic formula for the remaining equation',
              'Check all possible solutions'
            ]
          };
        }
      }
    ]
  };

  const difficultyProblems = problems[difficulty];
  const randomProblem = difficultyProblems[Math.floor(Math.random() * difficultyProblems.length)];
  return randomProblem.generate();
};

const generateGeometryProblem = (difficulty) => {
  const problems = {
    easy: [
      {
        type: 'area',
        generate: () => {
          const base = Math.floor(Math.random() * 10) + 1;
          const height = Math.floor(Math.random() * 10) + 1;
          return {
            question: `Find the area of a triangle with base ${base} and height ${height}`,
            answer: ((base * height) / 2).toString(),
            hints: [
              'Use the formula: Area = (base × height) / 2',
              `Substitute base = ${base} and height = ${height}`,
              'Calculate the result'
            ]
          };
        }
      }
    ],
    medium: [
      {
        type: 'volume',
        generate: () => {
          const radius = Math.floor(Math.random() * 5) + 1;
          const height = Math.floor(Math.random() * 10) + 1;
          return {
            question: `Find the volume of a cylinder with radius ${radius} and height ${height}`,
            answer: (Math.PI * radius * radius * height).toFixed(2),
            hints: [
              'Use the formula: Volume = πr²h',
              `Substitute r = ${radius} and h = ${height}`,
              'Calculate the result'
            ]
          };
        }
      }
    ]
  };

  const difficultyProblems = problems[difficulty];
  const randomProblem = difficultyProblems[Math.floor(Math.random() * difficultyProblems.length)];
  return randomProblem.generate();
};

export const generateMathExercise = (type, difficulty) => {
  const generators = {
    algebra: generateAlgebraProblem,
    geometry: generateGeometryProblem
  };

  const generator = generators[type];
  if (!generator) {
    throw new Error(`Unknown exercise type: ${type}`);
  }

  return generator(difficulty);
};

export const checkAnswer = (exercise, userAnswer) => {
  // For now, simple string comparison
  // In a real application, you'd want more sophisticated answer checking
  return {
    isCorrect: userAnswer.trim() === exercise.answer.trim(),
    correctAnswer: exercise.answer
  };
}; 