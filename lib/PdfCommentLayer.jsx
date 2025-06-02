import React, { useState } from "react";

export default function PdfCommentLayer({ totalPages, onCommentSubmit }) {
  const [selectedPage, setSelectedPage] = useState(0);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    const trimmed = commentText.trim();
    if (trimmed) {
      onCommentSubmit(trimmed, selectedPage);
      setCommentText("");
    }
  };

  return (
    <div className="p-4 border rounded shadow max-w-md bg-white">
      <select
        className="border p-2 mb-2 w-full"
        value={selectedPage}
        onChange={(e) => setSelectedPage(Number(e.target.value))}
      >
        {Array.from({ length: totalPages }, (_, i) => (
          <option key={i} value={i}>Page {i + 1}</option>
        ))}
      </select>

      <textarea
        className="w-full border p-2 mb-2"
        rows="3"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Comment
      </button>
    </div>
  );
}
