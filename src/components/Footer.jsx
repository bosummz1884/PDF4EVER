// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-muted/50 py-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} PDF4EVER. All rights reserved.
    </footer>
  );
};

export default Footer;
