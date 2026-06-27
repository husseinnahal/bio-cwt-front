import Image from "next/image"
import { Button } from "@/components/ui/button"

interface AdvantagesSectionProps {
  data?: {
    title?: string;
    advantages?: string[];
    image?: string;
  };
}

export function AdvantagesSection({ data }: AdvantagesSectionProps) {
  const titleText = data?.title || "Advantages\nWorking With Us";
  const advantagesList = data?.advantages || [
    "In-house carpentry production",
    "We only treat wood with environmentally friendly and safe products",
    "Prices from the manufacturer, no extra charges",
  ];
  const image = data?.image || "/advantage-stairs.png";

  const titleLines = titleText.split("\n");

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      {/* Uppercase Kyiv Type heading */}
      <h2 className="font-heading text-2xl uppercase leading-[1.5] w-[90%] sm:w-[80%] md:w-[50%] tracking-tight sm:text-4xl md:text-5xl text-foreground md:ml-[10%]">
        {titleLines.map((line, idx) => (
          <span key={idx} className="block">
            {line}
          </span>
        ))}
      </h2>

      {/* Grid: copy on left, vertical stairs image on right */}
      <div className="mt-16 grid items-center gap-12 md:grid-cols-2 md:gap-16">
        
        {/* left: Vertical staircase image */}
        <div className=" order-2 md:order-1 relative aspect-[12/8] w-full max-w-sm mx-auto overflow-hidden rounded-[32px] border border-white/5 shadow-2xl transition-transform duration-300 hover:scale-102">
          <Image 
            src={image} 
            alt="Wooden floating staircase" 
            fill 
            className="object-cover" 
          />
        </div>

        {/* right: Clean advantages sentences stacked */}
        <div className=" order-1 md:order-2 space-y-8 md:space-y-12">
          {advantagesList.map((item, idx) => (
            <div key={idx} className=" md:pl-5">
              <p className="text-sm sm:text-base leading-relaxed text-foreground w-[80%] max-w-md font-medium">
                {item}
              </p>
            </div>
          ))}
        </div>


      </div>

      {/* Centered CTA Button */}
      <div className="mt-16 flex justify-center">
        <Button className="rounded-full bg-primary hover:bg-secondary hover:text-secondary-foreground text-primary-foreground font-bold px-6 sm:px-12 py-6 text-xs uppercase tracking-widest transition-colors duration-300 shadow-md">
          Receive a consultation
        </Button>
      </div>
    </section>
  )
}
