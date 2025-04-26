const mathjs = require('mathjs');
const OpenAI = require('openai');
const logger = require('../utils/logger');

class MathAssistanceService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async solveProblem(problem, level = 'highschool') {
    try {
      // First try with mathjs for exact solutions
      try {
        const exactSolution = mathjs.evaluate(problem);
        return {
          solution: exactSolution,
          steps: [`Calculated directly: ${problem} = ${exactSolution}`],
          method: 'exact'
        };
      } catch (exactError) {
        // Fall back to AI for symbolic problems
        const response = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a ${level} math tutor. Explain solutions step-by-step in simple terms.`
            },
            {
              role: "user",
              content: `Solve this math problem: ${problem}`
            }
          ],
          temperature: 0.3
        });

        return {
          solution: response.choices[0].message.content,
          steps: this.extractSteps(response.choices[0].message.content),
          method: 'ai'
        };
      }
    } catch (error) {
      logger.error('Math solving error:', error);
      throw new Error('Could not solve this problem');
    }
  }

  extractSteps(content) {
    // Simple step extraction from AI response
    return content.split('\n')
      .filter(line => line.match(/step \d+/i) || line.match(/^\d+[.)]/))
      .map(line => line.trim());
  }

  async checkWork(problem, studentSolution) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a math teacher. Verify if the student's solution is correct. " +
                     "If incorrect, explain the mistake and show the correct solution."
          },
          {
            role: "user",
            content: `Problem: ${problem}\nStudent Solution: ${studentSolution}`
          }
        ],
        temperature: 0.2
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('Work verification error:', error);
      throw new Error('Could not verify the solution');
    }
  }
}

module.exports = new MathAssistanceService(); 