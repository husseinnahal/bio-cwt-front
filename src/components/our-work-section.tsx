"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface OurWorkSectionProps {
  data?: {
    images?: { src: string; alt: string }[];
  };
}

export function OurWorkSection({ data }: OurWorkSectionProps) {
  const slides = data?.images || [
    { src: "/work-kitchen.png", alt: "Custom wooden kitchen" },
    { src: "/hero-staircase.png", alt: "Wooden spiral staircase" },
    { src: "/hero-table.png", alt: "Solid wood dining table" },
  ];

  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
      {/* Centered Heading */}
      <h2 className="font-heading text-2xl uppercase leading-[1.05] tracking-tight sm:text-4xl md:text-5xl text-foreground md:ml-[10%]">
        Our Work
      </h2>

      {/* Slide Container & Navigation */}
      <div className="mt-10 flex items-center justify-between sm:mt-12 sm:gap-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="shrink-0 rounded-full p-2 text-[#A3B8D7] transition-all duration-300 hover:text-white hover:bg-white/5 active:scale-95"
        >
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>

        {/* Rounded Slide Card */}
        <div className="relative aspect-[25/16]  md:aspect-[14/8] w-full max-w-4xl overflow-hidden rounded-[20px] border border-white/5 bg-[#1E0C06] shadow-2xl">
          {slides.map((slide, i) => (
            <Image
              key={slide.src}
              src={slide.src || "/placeholder.svg"}
              alt={slide.alt}
              fill
              className={`object-cover transition-all duration-700 ease-in-out ${
                i === index ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="shrink-0 rounded-full p-2 text-[#A3B8D7] transition-all duration-300 hover:text-white hover:bg-white/5 active:scale-95"
        >
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="mt-8 flex justify-center gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i === index ? "bg-white border-[2px] border-[#A3B8D7] scale-110" : "border-[2px] border-[#A3B8D7] hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
