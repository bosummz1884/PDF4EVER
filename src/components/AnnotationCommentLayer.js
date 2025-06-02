import React, { useState } from 'react';

const AnnotationCommentLayer = ({ totalPages, onCommentSubmit }) => {
  const [selectedPage, setSelectedPage] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    const text = comment.trim();
    if (text.length > 0) {
      onCommentSubmit(text, selectedPage);
      setComment('');
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <label style={{ fontWeight: 'bold' }}>Page:</label>
      <select
        value={selectedPage}
        onChange={(e) => setSelectedPage(Number(e.target.value))}
        style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <option key={i} value={i}>
            Page {i + 1}
          </option>
        ))}
      </select>

      <div>
        <input
          type="text"
          value={comment}
          placeholder="Add a comment..."
          onChange={(e) => setComment(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '0.5rem' }}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: '8px 12px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        📨 Submit
      </button>
    </div>
  );
};

export default AnnotationCommentLayer;
