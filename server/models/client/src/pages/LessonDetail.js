// ... existing imports ...
import ExerciseCard from '../components/Exercises/ExerciseCard';

const LessonDetail = () => {
  // ... existing code ...

  return (
    <div className="lesson-container">
      {/* ... existing lesson content ... */}
      
      <section className="lesson-exercises">
        <h2>{t('exercises.title')}</h2>
        {lesson.exercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}
      </section>
    </div>
  );
};

export default LessonDetail;