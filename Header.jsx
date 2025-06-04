// src/components/Header.jsx
import React from "react";
import ThemeToggle from "./ThemeToggle.jsx";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold tracking-tight text-primary">
          PDF4EVER
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
