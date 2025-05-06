import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api'; // Your API service

export const LessonsContext = createContext();

export const LessonsProvider = ({ children }) => {
  const [featuredLessons, setFeaturedLessons] = useState([]);
  
  const fetchFeaturedLessons = async () => {
    try {
      const response = await api.get('/lessons/featured');
      setFeaturedLessons(response.data.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  return (
    <LessonsContext.Provider value={{ featuredLessons, fetchFeaturedLessons }}>
      {children}
    </LessonsContext.Provider>
  );
};

// Add the missing hook export
export const useLessons = () => useContext(LessonsContext);