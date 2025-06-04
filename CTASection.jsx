// src/components/CTASection.jsx
import React from "react";

const CTASection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 text-center md:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Ready to take control of your documents?
        </h2>
        <p className="mt-4 text-lg md:text-xl">
          Start editing and converting PDFs instantly — no sign up required.
        </p>
        <div className="mt-8">
          <a
            className="inline-flex h-12 items-center justify-center rounded-md bg-background px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-white"
            href="/editor"
          >
            Launch PDF Editor
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
