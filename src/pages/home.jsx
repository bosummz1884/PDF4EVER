// src/pages/home.jsx
import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="px-6 py-12 max-w-4xl mx-auto text-center space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text">PDF4EVER</h1>
        <p className="text-lg text-muted-foreground">
          The last PDF editor you’ll ever need. One-time payment. Lifetime access. No subscriptions.
        </p>
        <div className="mt-6">
          <Link href="/editor">
            <Button size="lg" className="hover-glow">
              Launch Editor <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <section className="text-left space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Why PDF4EVER?</h2>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>💸 One-time payment. No subscriptions. No hidden upgrade fees.</li>
            <li>🖋️ Inline editing, annotations, OCR, form creation, and more.</li>
            <li>🔐 Files never leave your machine. 100% local + private.</li>
            <li>🎨 Automatic font matching and smart layer detection.</li>
            <li>🧰 Includes camera-to-PDF, signature tools, merging, and drawing.</li>
          </ul>
        </div>
        <div className="text-muted-foreground text-sm italic">
          PDF4EVER is the first of many tools in the 4EVER suite. Stay tuned.
        </div>
      </section>
    </div>
  );
}
