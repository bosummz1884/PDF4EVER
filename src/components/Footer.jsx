// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-muted/50 py-8 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col items-center space-y-4">
        <p className="font-semibold text-foreground">© {year} PDF4EVER. All rights reserved.</p>
        <nav className="flex flex-wrap justify-center gap-6 text-xs">
          <Link to="/editor" className="hover:underline">
            Editor
          </Link>
          <Link to="/merge" className="hover:underline">
            Merge
          </Link>
          <Link to="/camera" className="hover:underline">
            Camera to PDF
          </Link>
          <a
            href="https://pdf4ever.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Main Site
          </a>
        </nav>
        <p className="text-[0.75rem] text-muted-foreground/80">
          Built with privacy-first technology. No tracking. No uploads.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
