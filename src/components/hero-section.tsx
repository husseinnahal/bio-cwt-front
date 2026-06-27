import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    images?: string[];
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  const titleText = data?.title || "Solid\nWood\nProducts";
  const subtitleText = data?.subtitle || "Oak, beech, ash from 1700 CZK per m3";
  const images = data?.images || [
    "/hero-carpentry.png",
    "/hero-staircase.png",
    "/hero-table.png",
  ];


  return (
    <section className="relative w-full overflow-hidden min-h-[640px] md:min-h-[720px] flex items-end">
      {/* Background wood logs image */}
      <div className="absolute inset-0 z-0 w-[60%]">
        <Image 
          src="/hero-img.png" 
          alt="Stacked wooden logs" 
          fill 
          priority 
          className="object-cover" 
        />
      </div>

      <div className="absolute right-0 z-10 w-[95%] sm:w-[90%] lg:w-[85%]  max-w-7xl pl-1 sm:pl-5 pb-20 pt-28 md:pl-6 md:pb-24 md:pt-36">
        {/* Main Hero Card */}
        <div className="relative  overflow-visible rounded-l-[26px] bg-card border border-white/5  shadow-2xl">
          <div className="relative flex gap-8 p-6 sm:p-10 justify-btween md:p-14">
            
            {/* Left copy column */}
            <div className="flex flex-col justify-center md:col-span-8 border-b-[2px] md:border-b-0 md:border-r-[2px] border-white pb-[10px] pr-[10px] w-full">
              <h1 className="font-heading text-3xl sm:text-5xl md:text-[56px]  uppercase leading-[1.1] tracking-tight text-foreground w-[70%] ">
                  {titleText}
              </h1>
              
              {/* Desktop layout for Subtitle + CTA */}
              <div className="hidden md:block">
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#FFDBBB]">
                  {subtitleText}
                </p>
                <div className="mt-8">
                  <Button className="rounded-lg bg-primary hover:bg-secondary hover:text-secondary-foreground text-foreground font-bold px-button-x py-button-y text-md  tracking-widest transition-colors duration-300">
                    Order
                  </Button>
                </div>
              </div>

              {/* Mobile layout: Subtitle + Button on left, Staircase Image on right */}
              <div className="mt-6 flex gap-4 md:hidden justify-between items-center">
                <div className="flex-1">
                  <p className="text-xs leading-relaxed text-[#F5F5F5]/70 max-w-[180px]">
                    {subtitleText}
                  </p>
                  <div className="mt-5">
                    <Button className="rounded-full bg-[#728BAD] hover:bg-[#5b7396] text-white font-bold px-8 py-4 text-[10px] uppercase tracking-widest transition-colors duration-300">
                      Order
                    </Button>
                  </div>
                </div>

                {/* Staircase image inside card on mobile */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px] border-2 border-white/10 shadow-lg">
                  <Image 
                    src={images[1] || "/hero-staircase.png"} 
                    alt="Wooden spiral staircase thumbnail" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>

            </div>

            {/* Right images column (desktop only) */}
            <div className="relative  hidden md:block md:col-span-4 h-[340px] w-full">
              {/* Top Right: Carpentry */}
              <div className="absolute right-0 -top-[50px] h-[170px] w-[170px] lg:h-[185px] lg:w-[185px] overflow-hidden rounded-[28px] border-4 border-[#1E0C06] shadow-2xl transition-transform hover:scale-105 duration-300">
                <Image 
                  src={images[0] || "/hero-carpentry.png"} 
                  alt="Carpenter working with wood" 
                  fill 
                  className="object-cover" 
                />
              </div>
              {/* Middle Left: Staircase */}
              <div className="absolute left-[20px] top-[100px] h-[170px] w-[170px] lg:h-[185px] lg:w-[185px] overflow-hidden rounded-[28px] border-4 border-[#1E0C06] shadow-2xl z-10 transition-transform hover:scale-105 duration-300">
                <Image 
                  src={images[1] || "/hero-staircase.png"} 
                  alt="Wooden spiral staircase" 
                  fill 
                  className="object-cover" 
                />
              </div>
              {/* Bottom Right: Table */}
              <div className="absolute right-0 -bottom-[50px] h-[170px] w-[170px] lg:h-[185px] lg:w-[185px] overflow-hidden rounded-[28px] border-4 border-[#1E0C06] shadow-2xl z-20 transition-transform hover:scale-105 duration-300">
                <Image 
                  src={images[2] || "/hero-table.png"} 
                  alt="Solid wood table" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

          </div>
        </div>

        {/* Overlapping thumbnail images row (mobile only) */}
        <div className="relative z-20 -mt-8 flex justify-between px-6 md:hidden">
          {/* Table image (overlaps bottom left of card) */}
          <div className="relative h-28 w-28 top-4  overflow-hidden rounded-[20px] border-4 border-[#222021] shadow-2xl">
            <Image 
              src={images[2] || "/hero-table.png"} 
              alt="Solid wood table thumbnail" 
              fill 
              className="object-cover" 
            />
          </div>

          {/* Carpentry image (overlaps bottom right, sits lower) */}
          <div className="relative h-28 w-28 mt-15 overflow-hidden rounded-[20px] border-4 border-[#222021] shadow-2xl">
            <Image 
              src={images[0] || "/hero-carpentry.png"} 
              alt="Carpenter handcraft thumbnail" 
              fill 
              className="object-cover" 
            />
          </div>
        </div>

      </div>
      
    </section>
  )
}
