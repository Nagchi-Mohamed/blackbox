import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ExerciseForm = ({ lessonId, onExerciseAdded }) => {
  const { i18n } = useTranslation();
  const [exercise, setExercise] = useState({
    question: { en: '', fr: '', es: '' },
    options: { en: ['', '', '', ''], fr: ['', '', '', ''], es: ['', '', '', ''] },
    correctAnswer: 0,
    explanation: { en: '', fr: '', es: '' },
    difficulty: 'medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to save exercise
    const response = await fetch(`/api/lessons/${lessonId}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercise)
    });
    const result = await response.json();
    onExerciseAdded(result);
    // Reset form
    setExercise({
      question: { en: '', fr: '', es: '' },
      options: { en: ['', '', '', ''], fr: ['', '', '', ''], es: ['', '', '', ''] },
      correctAnswer: 0,
      explanation: { en: '', fr: '', es: '' },
      difficulty: 'medium'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="exercise-form">
      <div className="form-group">
        <label>Question (English)</label>
        <input
          type="text"
          value={exercise.question.en}
          onChange={(e) => setExercise({...exercise, question: {...exercise.question, en: e.target.value}})}
        />
        {/* Repeat for French and Spanish */}
      </div>
      
      <div className="form-group">
        <label>Options (English)</label>
        {exercise.options.en.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...exercise.options.en];
              newOptions[index] = e.target.value;
              setExercise({...exercise, options: {...exercise.options, en: newOptions}});
            }}
          />
        ))}
        {/* Repeat for French and Spanish */}
      </div>

      <div className="form-group">
        <label>Correct Answer Index</label>
        <select
          value={exercise.correctAnswer}
          onChange={(e) => setExercise({...exercise, correctAnswer: parseInt(e.target.value)})}
        >
          {[0, 1, 2, 3].map((index) => (
            <option key={index} value={index}>Option {index + 1}</option>
          ))}
        </select>
      </div>

      <button type="submit">Add Exercise</button>
    </form>
  );
};

export default ExerciseForm;