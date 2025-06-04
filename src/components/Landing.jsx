// src/components/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="text-center pt-[20vh] bg-gradient-radial from-gray-800 to-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-4">PDF4EVER</h1>
      <p className="text-xl mb-8 text-gray-400">
        Edit. Convert. Merge. Annotate. All in your browser.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/editor"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
        >
          Launch Editor
        </Link>
        <a
          href="https://pdf4ever.org"
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
        >
          Visit Website
        </a>
      </div>
    </div>
  );
};

export default Landing;
