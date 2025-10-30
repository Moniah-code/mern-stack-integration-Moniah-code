import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ui.css';

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <h1>MERN Blog</h1>
            </Link>
            <nav className="nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/create" className="nav-link">Create Post</Link>
              {user ? (
                <>
                  <span className="nav-text">Welcome, {user.name}</span>
                  <button className="btn btn-secondary" onClick={() => {
                    logout();
                    window.location.reload();
                  }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="btn btn-primary">Register</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} MERN Blog — Built for learning</p>
          <div className="footer-links">
            <a href="https://github.com/Moniah-code" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="separator">·</span>
            <a href="/about">About</a>
            <span className="separator">·</span>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
