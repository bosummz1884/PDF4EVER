import React, { useEffect, useState } from 'react';
import { PDFDocumentProxy, getDocument } from 'pdfjs-dist';
import axios from 'axios';

const AiPdfSummarizer = ({ pdfBytes }) => {
  const [summary, setSummary] = useState("Processing...");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    summarizePdf();
  }, []);

  const summarizePdf = async () => {
    const loadingTask = getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;

    let fullText = "";
    const maxPages = Math.min(10, pdf.numPages);

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + "\n";
    }

    const openAiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a document summarizer." },
          { role: "user", content: `Summarize and tag this PDF text:\n\n${fullText}` }
        ],
        temperature: 0.7,
        max_tokens: 512,
      },
      {
        headers: {
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json",
        },
      }
    );

    const completion = openAiResponse.data.choices[0].message.content;
    setSummary(completion);
    setTags(extractTags(completion));
  };

  const extractTags = (text) => {
    const words = [...new Set(
      text.toLowerCase().match(/\b\w{5,}\b/g) || []
    )];
    return words.slice(0, 10);
  };

  return (
    <div>
      <h3>🧠 AI Summary:</h3>
      <p>{summary}</p>
      <h4 style={{ marginTop: '1rem' }}>🏷️ Tags:</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              background: '#eee',
              padding: '6px 10px',
              borderRadius: '10px',
              fontSize: '0.85rem'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AiPdfSummarizer;
