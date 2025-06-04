// src/components/OwnershipSection.jsx
import React from "react";

const OwnershipSection = () => {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background border-t">
      <div className="container px-4 text-center md:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Your documents. Your control.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          PDF4EVER runs entirely in your browser. Your files never leave your device unless you choose to save or share them.
        </p>
      </div>
    </section>
  );
};

export default OwnershipSection;
