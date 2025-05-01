import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseRenderer from './ExerciseRenderer';
import { useTranslation } from 'react-i18next';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

describe('ExerciseRenderer Component', () => {
  const mockExercise = {
    title: 'Test Exercise',
    question: 'What is 2 + 2?',
    hint: 'Try counting on your fingers',
    correctAnswer: '4',
    isCorrect: false
  };

  const mockOnSubmit = jest.fn();
  const mockOnHint = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders exercise title and question', () => {
    render(
      <ExerciseRenderer
        exercise={mockExercise}
        onSubmit={mockOnSubmit}
        onHint={mockOnHint}
      />
    );

    expect(screen.getByText('Test Exercise')).toBeInTheDocument();
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
  });

  test('handles answer submission', () => {
    render(
      <ExerciseRenderer
        exercise={mockExercise}
        onSubmit={mockOnSubmit}
        onHint={mockOnHint}
      />
    );

    const answerInput = screen.getByLabelText('exercises.answer');
    const submitButton = screen.getByText('exercises.submit');

    fireEvent.change(answerInput, { target: { value: '4' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('4');
  });

  test('shows hint when requested', () => {
    render(
      <ExerciseRenderer
        exercise={mockExercise}
        onSubmit={mockOnSubmit}
        onHint={mockOnHint}
      />
    );

    const hintButton = screen.getByText('exercises.hint');
    fireEvent.click(hintButton);

    expect(mockOnHint).toHaveBeenCalled();
    expect(screen.getByText('Try counting on your fingers')).toBeInTheDocument();
  });

  test('disables submit button when no answer is provided', () => {
    render(
      <ExerciseRenderer
        exercise={mockExercise}
        onSubmit={mockOnSubmit}
        onHint={mockOnHint}
      />
    );

    const submitButton = screen.getByText('exercises.submit');
    expect(submitButton).toBeDisabled();
  });

  test('shows correct/incorrect feedback after submission', () => {
    render(
      <ExerciseRenderer
        exercise={mockExercise}
        onSubmit={mockOnSubmit}
        onHint={mockOnHint}
      />
    );

    const answerInput = screen.getByLabelText('exercises.answer');
    const submitButton = screen.getByText('exercises.submit');

    fireEvent.change(answerInput, { target: { value: '5' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('exercises.incorrect')).toBeInTheDocument();
    expect(screen.getByText(/Correct Answer: 4/)).toBeInTheDocument();
  });
}); 