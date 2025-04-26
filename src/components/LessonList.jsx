import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SortableHeader from './SortableHeader';
import './LessonList.css';

const LessonList = ({ moduleId }) => {
  const [lessons, setLessons] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    contentType: '',
    isFreePreview: null
  });
  const [sort, setSort] = useState('sequence_order:ASC');
  const [loading, setLoading] = useState(false);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sort,
        ...(filters.search && { search: filters.search }),
        ...(filters.contentType && { contentType: filters.contentType }),
        ...(filters.isFreePreview !== null && { 
          isFreePreview: filters.isFreePreview 
        })
      });

      const response = await axios.get(
        `/api/lessons/module/${moduleId}?${params.toString()}`
      );
      
      setLessons(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [moduleId, pagination.page, filters, sort]);

  return (
    <div className="lesson-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search lessons..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
        
        <select
          value={filters.contentType}
          onChange={(e) => setFilters({...filters, contentType: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="video">Video</option>
          <option value="text">Text</option>
          <option value="quiz">Quiz</option>
        </select>
        
        <label>
          <input
            type="checkbox"
            checked={filters.isFreePreview === true}
            onChange={(e) => setFilters({
              ...filters, 
              isFreePreview: e.target.checked || null
            })}
          />
          Free Preview Only
        </label>
      </div>

      {loading ? (
        <div>Loading lessons...</div>
      ) : (
        <table className="lessons-table">
          <thead>
            <tr>
              <SortableHeader 
                field="sequence_order" 
                currentSort={sort}
                onSortChange={setSort}
              >
                Order
              </SortableHeader>
              
              <SortableHeader 
                field="title" 
                currentSort={sort}
                onSortChange={setSort}
              >
                Title
              </SortableHeader>
              
              <SortableHeader 
                field="duration_minutes" 
                currentSort={sort}
                onSortChange={setSort}
              >
                Duration
              </SortableHeader>
              
              <SortableHeader 
                field="created_at" 
                currentSort={sort}
                onSortChange={setSort}
              >
                Created
              </SortableHeader>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.lesson_id}>
                <td>{lesson.sequence_order}</td>
                <td>{lesson.title}</td>
                <td>{lesson.duration_minutes} mins</td>
                <td>
                  {new Date(lesson.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => setPagination({...pagination, page: pagination.page - 1})}
        >
          Previous
        </button>
        
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        
        <button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => setPagination({...pagination, page: pagination.page + 1})}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LessonList; 