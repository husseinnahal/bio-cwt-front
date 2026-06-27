import Image from "next/image"
import { Check, X } from "lucide-react"

type Feature = { label: string; positive: boolean }

type WoodType = {
  name: string
  image: string
  features: Feature[]
}

const defaultWoodTypes: WoodType[] = [
  {
    name: "Oak",
    image: "/wood-oak.png",
    features: [
      { label: "Durability", positive: true },
      { label: "Beautiful texture", positive: true },
      { label: "Water resistance", positive: true },
      { label: "Expensive", positive: false },
    ],
  },
  {
    name: "Buk",
    image: "/wood-buk.png",
    features: [
      { label: "Durability", positive: true },
      { label: "Hard to handle", positive: false },
    ],
  },
  {
    name: "Ash",
    image: "/wood-ash.png",
    features: [
      { label: "Durability", positive: true },
      { label: "Hard to handle", positive: false },
    ],
  },
]

interface WoodTypesSectionProps {
  data?: WoodType[];
}

export function WoodTypesSection({ data }: WoodTypesSectionProps) {
  const woodTypesList = data && data.length > 0 ? data : defaultWoodTypes;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
      {/* Capitalized, clean Kyiv Type heading */}
      <h2 className="font-heading text-2xl uppercase leading-[1.05] tracking-tight sm:text-4xl md:text-5xl text-foreground md:ml-[10%]">
        The Wood We
        <br />
        Work With
      </h2>

      {/* Swipeable on mobile, dynamic grid on desktop */}
      <div className="mt-14 flex gap-8 overflow-x-auto pb-6 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-3 sm:gap-12      scroll-smooth
        scrollbar-thin
        scrollbar-thumb-[#B0B4BDBF]
        scrollbar-track-[#32353CBF]
        ">
        {woodTypesList.map((wood,idx) => (
          <div key={wood.name} className={`w-[200px] shrink-0 sm:w-auto flex flex-col items-center ${idx % 2 === 1 ? "mt-10 md:mt-0" : "mt-0"}`}>
            {/* Custom rounded border image wrapper */}
            <div className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] overflow-hidden rounded-[32px] border border-white/5 shadow-2xl transition-transform duration-300 hover:scale-105">
              <Image
                src={wood.image || "/placeholder.svg"}
                alt={`${wood.name} wood sample`}
                width={240}
                height={240}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Centered Name */}
            <h3 className="mt-5 font-heading text-lg md:text-xl font-bold uppercase tracking-wider text-white">
              {wood.name}
            </h3>

            {/* Left-aligned feature list below the centered header */}
            <ul className="mt-6 space-y-3 w-[180px] text-xs sm:text-sm">
              {wood.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-white/80">
                  {feature.positive ? (
                    <Check className="h-4 w-4 shrink-0 text-[#FFC099] mt-0.5" aria-hidden="true" />
                  ) : (
                    <X className="h-4 w-4 shrink-0 text-[#FFC099] mt-0.5" aria-hidden="true" />
                  )}
                  <span className="leading-tight">{feature.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
