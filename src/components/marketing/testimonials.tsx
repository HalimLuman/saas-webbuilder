"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "Webperia completely transformed how our team builds landing pages. What used to take a week now takes hours. The AI generator is mind-blowing.",
    author: "Sarah Chen",
    role: "Head of Marketing",
    company: "Prismatic",
    rating: 5,
    avatar: "SC",
    avatarColor: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    quote:
      "As a solo founder, Webperia is my secret weapon. I launched my SaaS landing page in one afternoon, and it looks like it was designed by a professional agency.",
    author: "Marcus Rodriguez",
    role: "Founder & CEO",
    company: "Launchpad.io",
    rating: 5,
    avatar: "MR",
    avatarColor: "from-primary-500 to-purple-600",
  },
  {
    id: 3,
    quote:
      "The drag-and-drop editor is incredibly intuitive. My non-technical team members can now update the website themselves without any developer involvement.",
    author: "Emily Watson",
    role: "Product Manager",
    company: "Acme Corp",
    rating: 5,
    avatar: "EW",
    avatarColor: "from-pink-500 to-rose-500",
  },
  {
    id: 4,
    quote:
      "We switched from a custom-built CMS to Webperia and haven't looked back. The Vercel integration made deployment effortless, and performance is stellar.",
    author: "James Park",
    role: "CTO",
    company: "TechFlow",
    rating: 5,
    avatar: "JP",
    avatarColor: "from-green-500 to-emerald-500",
  },
];

const companyLogos = [
  "Stackwell", "Meridian", "Driftworks", "Apexly", "Lumenary", "Orion Studio", "Waveline", "Pinnacle"
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company logos */}
        <div className="mb-24">
          <p className="text-center text-gray-400 text-sm font-medium uppercase tracking-widest mb-10">
            Trusted by teams at leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {companyLogos.map((logo) => (
              <div
                key={logo}
                className="px-6 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 font-semibold text-lg hover:text-gray-600 hover:bg-gray-100 transition-all cursor-default"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <Quote className="h-10 w-10 text-primary-200" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-2xl sm:text-3xl text-gray-700 font-medium leading-relaxed mb-10">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${current.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                  {current.avatar}
                </div>
                <div className="text-left">
                  <div className="text-gray-900 font-semibold">{current.author}</div>
                  <div className="text-gray-400 text-sm">
                    {current.role} at{" "}
                    <span className="text-gray-600">{current.company}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-6 bg-primary-500"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
