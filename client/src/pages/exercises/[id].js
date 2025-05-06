import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ExerciseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { i18n, t } = useTranslation();
  const [exercise, setExercise] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/exercises/${id}?lang=${i18n.language}`)
      .then(res => res.json())
      .then(data => setExercise(data));
  }, [i18n.language, id]);

  if (!exercise) return <div>{t('loading')}</div>;

  return (
    <div>
      <h1>{exercise.title[i18n.language]}</h1>
      <p>{exercise.content[i18n.language]}</p>
      {exercise.solutionUrl && (
        <a href={exercise.solutionUrl} download>{t('download_solution')}</a>
      )}
    </div>
  );
}
