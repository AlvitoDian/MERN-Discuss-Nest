import React, { useState } from "react";

export default function HeroSection() {
  return (
    <>
      {" "}
      <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-white min-h-screen flex items-center hero">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-emerald-400">
            Welcome to Discuss Nest
          </h1>
          <p className="text-md mb-8 text-emerald-300 italic">
            Head to Head Discussions.
          </p>
          <a
            href="/forum"
            className="bg-emerald-400 text-neutral-900 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>
    </>
  );
}
