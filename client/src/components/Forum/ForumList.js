import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ForumPost from './ForumPost';

const ForumList = () => {
  const [posts, setPosts] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/forum');
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="forum-container">
      <h2>{t('forum.title')}</h2>
      {posts.map(post => (
        <ForumPost key={post._id} post={post} />
      ))}
    </div>
  );
};

export default ForumList;