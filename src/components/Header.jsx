// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary">
            PDF4EVER
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/editor" className="text-muted-foreground hover:text-primary transition">
              Editor
            </Link>
            <Link to="/merge" className="text-muted-foreground hover:text-primary transition">
              Merge
            </Link>
            <Link to="/camera" className="text-muted-foreground hover:text-primary transition">
              Camera
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
