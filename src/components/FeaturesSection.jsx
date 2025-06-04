// src/components/FeaturesSection.jsx
import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Edit PDFs",
      description: "Add text, highlight, sign, and draw directly in your PDFs with intuitive tools.",
    },
    {
      title: "Merge Files",
      description: "Combine multiple PDFs into a single document in just seconds.",
    },
    {
      title: "Camera to PDF",
      description: "Take a photo or upload an image and instantly convert it to a PDF.",
    },
    {
      title: "Text Recognition (OCR)",
      description: "Turn scanned pages into editable, searchable documents with advanced OCR.",
    },
    {
      title: "Multi-Device Access",
      description: "Start on desktop, continue on mobile. Your PDFs follow you everywhere.",
    },
    {
      title: "Fast, Secure & Private",
      description: "Your files stay on your device unless you choose to upload. Privacy first.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need in One Place
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            PDF4EVER brings professional-grade tools into a sleek, browser-based interface—no installs, no clutter.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
