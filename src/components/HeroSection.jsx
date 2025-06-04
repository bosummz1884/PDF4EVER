// src/components/HeroSection.jsx
import React from "react";

const HeroSection = () => {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 text-center md:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
          PDF4EVER: The Ultimate PDF Toolkit
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
          Edit, sign, annotate, and convert PDFs directly in your browser — no downloads needed. Built for creators, professionals, and everyday users.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            href="/editor"
          >
            Launch Editor
          </a>
          <a
            className="inline-flex h-12 items-center justify-center rounded-md bg-muted px-6 text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:bg-muted/80"
            href="https://pdf4ever.org"
          >
            Visit Website
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
