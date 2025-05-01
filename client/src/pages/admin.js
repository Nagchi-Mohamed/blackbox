import { useState } from 'react';

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    title: { en: '', fr: '' },
    content: { en: '', fr: '' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/lessons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    alert('Lesson created!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="English Title"
        value={formData.title.en}
        onChange={(e) => setFormData({
          ...formData,
          title: { ...formData.title, en: e.target.value }
        })}
      />
      <input 
        placeholder="French Title"
        value={formData.title.fr}
        onChange={(e) => setFormData({
          ...formData,
          title: { ...formData.title, fr: e.target.value }
        })}
      />
      <textarea 
        placeholder="English Content"
        value={formData.content.en}
        onChange={(e) => setFormData({
          ...formData,
          content: { ...formData.content, en: e.target.value }
        })}
      />
      <textarea 
        placeholder="French Content"
        value={formData.content.fr}
        onChange={(e) => setFormData({
          ...formData,
          content: { ...formData.content, fr: e.target.value }
        })}
      />
      <button type="submit">Save</button>
    </form>
  );
}
