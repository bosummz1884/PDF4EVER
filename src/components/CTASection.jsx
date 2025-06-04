// src/components/CTASection.jsx
import React from "react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 text-center md:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Ready to take control of your documents?
        </h2>
        <p className="mt-4 text-lg md:text-xl max-w-xl mx-auto">
          Start editing and converting PDFs instantly — no sign up required.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/editor"
            className="inline-flex h-12 items-center justify-center rounded-md bg-background px-6 text-sm font-semibold text-primary shadow hover:bg-white transition"
          >
            Launch PDF Editor
          </Link>
          <a
            href="https://pdf4ever.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white px-6 text-sm font-medium hover:bg-white/10 transition"
          >
            Explore More Tools
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
