"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calculator } from "lucide-react"
import { QuestionsSection } from "@/components/questions-section"

interface PriceRow {
  length: number
  width: number
  thickness: number
  cubicMeter: number
  pricePerM3: number
  pricePerPiece: number
}

interface Service {
  id: string
  name: string
  prices: PriceRow[]
}

const defaultServices: Service[] = [
  {
    id: "default-1",
    name: "buk pr",
    prices: [
      { length: 1000, width: 300, thickness: 40, cubicMeter: 0.012, pricePerM3: 1100, pricePerPiece: 462 },
      { length: 1100, width: 300, thickness: 40, cubicMeter: 0.0132, pricePerM3: 1100, pricePerPiece: 508.2 },
      { length: 800, width: 300, thickness: 40, cubicMeter: 0.0096, pricePerM3: 1100, pricePerPiece: 369.6 },
      { length: 900, width: 300, thickness: 40, cubicMeter: 0.0108, pricePerM3: 1100, pricePerPiece: 415.8 },
    ],
  },
  {
    id: "default-2",
    name: "buk cink",
    prices: [
      { length: 3000, width: 400, thickness: 20, cubicMeter: 0.024, pricePerM3: 1000, pricePerPiece: 840 },
      { length: 4000, width: 300, thickness: 20, cubicMeter: 0.024, pricePerM3: 1000, pricePerPiece: 840 },
      { length: 4000, width: 400, thickness: 20, cubicMeter: 0.032, pricePerM3: 1000, pricePerPiece: 1120 },
    ],
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  useEffect(() => {
    async function loadServices() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      try {
        const res = await fetch(`${apiUrl}/services`, { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setServices(data)
            setLoading(false)
            return
          }
        }
      } catch (e) {
        console.error("Failed to load services, falling back to mockups", e)
      }
      setServices(defaultServices)
      setLoading(false)
    }

    loadServices()
  }, [])

  // Group services into pairs of 2 for carousel slides
  const slides: Service[][] = []
  for (let i = 0; i < services.length; i += 2) {
    slides.push(services.slice(i, i + 2))
  }

  const prevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % slides.length)
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#728BAD] animate-spin" />
        <p className="mt-4 text-[#8ba393] text-sm animate-pulse">Loading Price Matrix Catalog...</p>
      </div>
    )
  }

  const activeSlide = slides[activeSlideIndex] || []

  return (
    <div className="relative">
      
      {/* Price list main section */}
      <section className="mx-auto max-w-7xl  px-1 md:px-5 pb-16 pt-20 md:pt-40 relative">
        <h1 className="font-heading text-2xl uppercase leading-[1.05] tracking-tight sm:text-4xl md:text-5xl text-foreground md:ml-[10%] px-4">
          Price List
        </h1>

        {/* Carousel grid container with side navigation arrows */}
        <div className="relative flex items-center justify-between md:gap-4">
          
          {/* Left Arrow Button */}
          {slides.length > 1 && (
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
               className="shrink-0 rounded-full md:p-2 text-[#A3B8D7] transition-all duration-300 hover:text-white hover:bg-white/5 active:scale-95 p-0"
            >
              <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" />
            </button>
          )}

          {/* Cards Stack (Slide content) */}
          <div className="w-full mt-10 space-y-8 max-w-4xl mx-auto z-10 transition-all duration-500">
            {activeSlide.map((service) => (
              <div 
                key={service.id} 
                className="flex flex-row gap-1 sm:gap-2 md:gap-4 items-stretch w-full"
              >
                {/* Left Card: Dimensions */}
                <div className="flex bg-[#E5E5E5] text-[#222021] rounded-[20px] sm:rounded-[32px] p-2 sm:p-4 md:p-5 flex-1 shadow-2xl border border-white/5 min-w-0">
                  {/* services Name Column */}
                  <div className="flex items-center justify-center font-heading font-extrabold text-[9px] sm:text-xs md:text-base uppercase tracking-wider pr-1 mr-1 sm:pr-4 sm:mr-4 border-r border-[#222021]/15 w-[35px] sm:w-[60px] md:w-[90px] text-center text-[#222021] shrink-0">
                    {service.name}
                  </div>
                  
                  {/* Dimensions Table */}
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-3 text-[9px] sm:text-xs tracking-wider font-extrabold text-[#222021]/60 border-b border-[#222021]/15 pb-1 sm:pb-2 mb-2 sm:mb-3">
                      <div className="underline decoration-dotted underline-offset-2 sm:underline-offset-4">délka</div>
                      <div className="underline decoration-dotted underline-offset-2 sm:underline-offset-4">šiřka</div>
                      <div className="underline decoration-dotted underline-offset-2 sm:underline-offset-4">tloustka</div>
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                      {service.prices.map((row, rIdx) => (
                        <div 
                          key={rIdx} 
                          className="grid grid-cols-3 text-[9px] sm:text-xs md:text-base font-bold text-[#222021]"
                        >
                          <div>{row.length}</div>
                          <div>{row.width}</div>
                          <div>{row.thickness}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Card: Volumetric Pricing */}
                <div className="flex bg-[#E5E5E5] text-[#222021] rounded-[20px] sm:rounded-[32px] overflow-hidden flex-1 shadow-2xl border border-white/5 min-w-0">
                  {/* Volumes & Price per m3 */}
                  <div className="flex-1 p-1 sm:p-5 min-w-0">
                    <div className="grid grid-cols-2 text-[9px] sm:text-xs tracking-wider font-extrabold text-[#222021]/60 border-b border-[#222021]/15 pb-1 sm:pb-2 mb-2 sm:mb-3">
                      <div>m3</div>
                      <div>cena m3</div>
                    </div>
                    <div className="space-y-2 sm:space-y-4">
                      {service.prices.map((row, rIdx) => (
                        <div 
                          key={rIdx} 
                          className="grid grid-cols-2 text-[9px] sm:text-xs md:text-base font-bold text-[#222021]"
                        >
                          <div className="truncate">{row.cubicMeter.toString().replace(".", ",")}</div>
                          <div>{row.pricePerM3}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlighted Price per piece (Cena ks. column) */}
                  <div className="bg-[#E79B7A] w-[65px] sm:w-[130px] p-1 sm:p-5 flex flex-col border-l border-[#222021]/10 shrink-0">
                    <div className="text-[9px] sm:text-xs uppercase tracking-wider font-extrabold text-[#222021]/65 border-b border-[#222021]/15 pb-1 sm:pb-2 mb-2 sm:mb-3 text-center">
                      cena ks.
                    </div>
                    <div className="space-y-2 sm:space-y-4 flex-1">
                      {service.prices.map((row, rIdx) => (
                        <div 
                          key={rIdx} 
                          className="text-[9px] sm:text-xs md:text-base font-extrabold text-[#222021] text-center"
                        >
                          {row.pricePerPiece.toString().replace(".", ",")}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          {slides.length > 1 && (
            <button
              onClick={nextSlide}
              aria-label="Next slide"
          className="shrink-0 p-0 rounded-full md:p-2 text-[#A3B8D7] transition-all duration-300 hover:text-white hover:bg-white/5 active:scale-95"
            >
              <ChevronRight className="h-8 w-8 md:h-10 md:w-10" />
            </button>
          )}

        </div>

        {/* Carousel Slide Indicators */}
        {slides.length > 1 && (
          <div className="mt-10 flex justify-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlideIndex(i)}
                aria-label={`Go to slide ${i + 1}`}

                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    i === activeSlideIndex ? "bg-white border-[2px] border-[#A3B8D7] scale-110" : "border-[2px] border-[#A3B8D7] hover:bg-white/50"
                  }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Inline Any Questions contact form widget directly underneath the Price list */}
      <QuestionsSection />
      
    </div>
  )
}
