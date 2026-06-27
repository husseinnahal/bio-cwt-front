import Image from "next/image"
import Link from "next/link"
import { Phone, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-[#141210] relative  border-t border-white/5 z-20">
      <div className="mx-auto max-w-6xl px-6 py-12 z-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between text-center md:text-left">
          
          {/* Logo container */}
          <div className="flex justify-center md:justify-start">
            <div className="relative h-[34px] w-[90px] md:h-[38px] md:w-[100px]">
              <Image 
                src="/logo.svg" 
                alt="BIO CWT logo" 
                fill 
                className="object-contain" 
              />
            </div>
          </div>

          {/* Phone block */}
          <div className="flex flex-row items-center justify-center gap-3 text-sm text-white/80">
              <Phone className="h-7 w-7 text-white" aria-hidden="true" />
            <span className="font-semibold tracking-wide">+420 000 000 000</span>
          </div>

          {/* Location / Address block */}
          <div className="flex flex-row items-center justify-center gap-3 text-sm text-white/80">
              <MapPin className="h-7 w-7 text-white" aria-hidden="true" />
            <span className="font-medium text-xs leading-relaxed text-left">
              Na Plzeňce 1166/0
              <br />
              Prague 5 - Smíchov, 150 00
            </span>
          </div>

        </div>

        {/* Bottom border & Privacy policy */}
        <div className="mt-10 border-t border-white/5 pt-6 ">
          <Link href="#" className="text-xs text-white/80 hover:text-white transition-colors duration-300">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
