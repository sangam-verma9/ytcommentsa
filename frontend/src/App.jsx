import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (!link) {
      alert('Please enter a valid YouTube video link.');
      return;
    }
    navigate('/results', { state: { link } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">YouTube Comment Analyzer</h1>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
        />
        <button
          onClick={handleAnalyze}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Analyze Comments
        </button>
      </div>
    </div>
  );
}
