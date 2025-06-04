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
  ];

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need in One Place
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            PDF4EVER brings you powerful tools in a clean, browser-based workspace.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg border bg-background p-6 shadow-sm">
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
