// src/components/OwnershipSection.jsx
import React from "react";

const OwnershipSection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-gray-950 text-white border-t border-gray-800">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Your Documents. Your Control.
        </h2>
        <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          PDF4EVER runs entirely in your browser. Your files never leave your device unless you choose to save or share them.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 max-w-md w-full text-left">
            <p className="text-sm text-gray-400 mb-2">Why PDF4EVER?</p>
            <ul className="space-y-2 text-sm list-disc list-inside text-gray-300">
              <li>No file uploads or cloud processing</li>
              <li>Completely private and secure</li>
              <li>Fast, in-browser performance</li>
              <li>No ads or tracking — ever</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnershipSection;
