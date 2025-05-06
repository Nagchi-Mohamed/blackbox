import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LessonsManagement = () => {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    title: { en: '', fr: '', es: '' },
    content: { en: '', fr: '', es: '' },
    pdfUrl: '',
    level: 'primary',
    pdfSize: 0
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await axios.get('/lessons');
      setLessons(res.data);
    } catch (error) {
      alert('Failed to fetch lessons');
    }
  };

  const handleChange = (e, field, lang) => {
    if (lang) {
      setForm({
        ...form,
        [field]: {
          ...form[field],
          [lang]: e.target.value
        }
      });
    } else {
      setForm({
        ...form,
        [field]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/lessons/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post('/lessons', form);
      }
      setForm({
        title: { en: '', fr: '', es: '' },
        content: { en: '', fr: '', es: '' },
        pdfUrl: '',
        level: 'primary',
        pdfSize: 0
      });
      fetchLessons();
    } catch (error) {
      alert('Failed to save lesson');
    }
  };

  const handleEdit = (lesson) => {
    setEditingId(lesson._id);
    setForm({
      title: lesson.title,
      content: lesson.content,
      pdfUrl: lesson.pdfUrl,
      level: lesson.level,
      pdfSize: lesson.pdfSize
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await axios.delete(`/lessons/${id}`);
      fetchLessons();
    } catch (error) {
      alert('Failed to delete lesson');
    }
  };

  return (
    <div>
      <h2>Lessons Management</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title (EN):</label>
          <input value={form.title.en} onChange={(e) => handleChange(e, 'title', 'en')} required />
        </div>
        <div>
          <label>Title (FR):</label>
          <input value={form.title.fr} onChange={(e) => handleChange(e, 'title', 'fr')} />
        </div>
        <div>
          <label>Title (ES):</label>
          <input value={form.title.es} onChange={(e) => handleChange(e, 'title', 'es')} />
        </div>
        <div>
          <label>Content (EN):</label>
          <textarea value={form.content.en} onChange={(e) => handleChange(e, 'content', 'en')} required />
        </div>
        <div>
          <label>Content (FR):</label>
          <textarea value={form.content.fr} onChange={(e) => handleChange(e, 'content', 'fr')} />
        </div>
        <div>
          <label>Content (ES):</label>
          <textarea value={form.content.es} onChange={(e) => handleChange(e, 'content', 'es')} />
        </div>
        <div>
          <label>PDF URL:</label>
          <input value={form.pdfUrl} onChange={(e) => handleChange(e, 'pdfUrl')} required />
        </div>
        <div>
          <label>Level:</label>
          <select value={form.level} onChange={(e) => handleChange(e, 'level')}>
            <option value="primary">Primary</option>
            <option value="middle">Middle</option>
            <option value="high">High</option>
            <option value="college">College</option>
          </select>
        </div>
        <div>
          <label>PDF Size (bytes):</label>
          <input type="number" value={form.pdfSize} onChange={(e) => handleChange(e, 'pdfSize')} required />
        </div>
        <button type="submit">{editingId ? 'Update' : 'Add'} Lesson</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: { en: '', fr: '', es: '' }, content: { en: '', fr: '', es: '' }, pdfUrl: '', level: 'primary', pdfSize: 0 }); }}>Cancel</button>}
      </form>
      <hr />
      <h3>Existing Lessons</h3>
      <ul>
        {Array.isArray(lessons) && lessons.map((lesson) => (
          <li key={lesson._id}>
            <strong>{lesson.title.en}</strong> ({lesson.level}) - <button onClick={() => handleEdit(lesson)}>Edit</button> <button onClick={() => handleDelete(lesson._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonsManagement;
