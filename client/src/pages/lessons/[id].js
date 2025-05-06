import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LessonDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { i18n, t } = useTranslation();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/lessons/${id}?lang=${i18n.language}`)
      .then(res => res.json())
      .then(data => setLesson(data));
  }, [i18n.language, id]);

  if (!lesson) return <div>{t('loading')}</div>;

  return (
    <div>
      <h1>{lesson.title[i18n.language]}</h1>
      <p>{lesson.content[i18n.language]}</p>
      <a href={lesson.pdfUrl} download>{t('download_pdf')}</a>
    </div>
  );
}
