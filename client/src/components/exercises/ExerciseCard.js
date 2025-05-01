import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ExerciseCard = ({ exercise }) => {
  const { i18n, t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSolution(true);
  };

  return (
    <div className="exercise-card">
      <h3>{exercise.question[i18n.language]}</h3>
      <form onSubmit={handleSubmit}>
        {exercise.options[i18n.language].map((option, index) => (
          <div key={index} className="option">
            <input
              type="radio"
              id={`option-${index}`}
              name="exercise-option"
              checked={selectedOption === index}
              onChange={() => setSelectedOption(index)}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
        <button type="submit">{t('exercises.submit')}</button>
        <button 
          type="button" 
          onClick={() => setShowSolution(!showSolution)}
          className="solution-toggle"
        >
          {showSolution ? t('exercises.hideSolution') : t('exercises.showSolution')}
        </button>
      </form>
      {showSolution && (
        <div className="solution">
          <h4>{t('exercises.solution')}</h4>
          <p>{exercise.explanation[i18n.language]}</p>
          <p><strong>{t('exercises.correctAnswer')}:</strong> {exercise.options[i18n.language][exercise.correctAnswer]}</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;