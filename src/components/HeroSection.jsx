// src/components/HeroSection.jsx
import React from "react";

const HeroSection = () => {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40">
      <div className="container px-4 text-center md:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          The Ultimate PDF Toolkit.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          Edit, sign, annotate, and convert PDFs directly in your browser — no downloads needed.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            href="/editor"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
