import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LessonCard from '../components/Lessons/LessonCard';
import ForumPost from '../components/Forum/ForumPost';

const SearchResults = () => {
  const [results, setResults] = useState({ lessons: [], forumPosts: [] });
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'en';

    const fetchResults = async () => {
      const response = await fetch(`/api/search?q=${query}&lang=${lang}`);
      const data = await response.json();
      setResults(data);
    };

    if (query) {
      fetchResults();
    }
  }, [location.search]);

  return (
    <div className="search-results">
      <h2>{t('search.results')}</h2>
      
      <section className="lessons-results">
        <h3>{t('search.lessons')}</h3>
        {results.lessons.length > 0 ? (
          results.lessons.map(lesson => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))
        ) : (
          <p>{t('search.noLessons')}</p>
        )}
      </section>

      <section className="forum-results">
        <h3>{t('search.discussions')}</h3>
        {results.forumPosts.length > 0 ? (
          results.forumPosts.map(post => (
            <ForumPost key={post._id} post={post} />
          ))
        ) : (
          <p>{t('search.noDiscussions')}</p>
        )}
      </section>
    </div>
  );
};

export default SearchResults;