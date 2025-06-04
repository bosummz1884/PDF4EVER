// src/components/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing-container" style={styles.container}>
      <h1 style={styles.header}>PDF4EVER</h1>
      <p style={styles.subhead}>Edit. Convert. Merge. Annotate. All in your browser.</p>
      <div style={styles.buttonGroup}>
        <Link to="/editor" style={styles.button}>
          Launch Editor
        </Link>
        <a href="https://pdf4ever.org" style={{ ...styles.button, backgroundColor: '#444' }}>
          Visit Website
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: '20vh',
    background: 'radial-gradient(circle at center, #1f2937, #111827)',
    color: '#f9fafb',
    height: '100vh',
  },
  header: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  subhead: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: '#9ca3af',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    color: '#fff',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
  },
};

export default Landing;
