import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoutineGenerator from "@/components/RoutineGenerator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-neutral-800 mb-2">
              Your Personalized Supplement Routine
            </h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">
              Tell us about your health goals and lifestyle to receive a customized supplement and 
              nutrition plan backed by science.
            </p>
          </div>
          <RoutineGenerator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
