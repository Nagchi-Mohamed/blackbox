import { useRouter } from 'next/router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function LessonDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { language } = useLanguage();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/lessons/${id}?lang=${language}`)
      .then(res => res.json())
      .then(data => setLesson(data));
  }, [language, id]);

  if (!lesson) return <div>Loading...</div>;

  return (
    <div>
      <h1>{lesson.title[language]}</h1>
      <p>{lesson.content[language]}</p>
      <a href={lesson.pdfUrl} download>Download PDF</a>
    </div>
  );
}
