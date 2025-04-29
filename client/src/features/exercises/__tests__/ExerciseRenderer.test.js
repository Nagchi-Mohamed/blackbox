import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExerciseRenderer from '../ExerciseRenderer';

describe('ExerciseRenderer Component', () => {
  const mockExercise = {
    id: '1',
    type: 'multiple-choice',
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    points: 10
  };

  test('should render exercise question and options', () => {
    render(<ExerciseRenderer exercise={mockExercise} />);

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    mockExercise.options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test('should handle option selection', () => {
    const onAnswerSubmit = jest.fn();
    render(
      <ExerciseRenderer 
        exercise={mockExercise} 
        onAnswerSubmit={onAnswerSubmit}
      />
    );

    const correctOption = screen.getByText('4');
    fireEvent.click(correctOption);

    expect(onAnswerSubmit).toHaveBeenCalledWith('4');
  });

  test('should display feedback for correct answer', () => {
    render(
      <ExerciseRenderer 
        exercise={mockExercise}
        userAnswer="4"
        isCorrect={true}
      />
    );

    expect(screen.getByText(/correct/i)).toBeInTheDocument();
  });

  test('should display feedback for incorrect answer', () => {
    render(
      <ExerciseRenderer 
        exercise={mockExercise}
        userAnswer="3"
        isCorrect={false}
      />
    );

    expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
    expect(screen.getByText(/correct answer: 4/i)).toBeInTheDocument();
  });

  test('should render different exercise types', () => {
    const textExercise = {
      ...mockExercise,
      type: 'text',
      question: 'Explain the concept of variables in programming.'
    };

    render(<ExerciseRenderer exercise={textExercise} />);
    expect(screen.getByPlaceholderText(/type your answer/i)).toBeInTheDocument();
  });
}); 