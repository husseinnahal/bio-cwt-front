import { Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 md:pt-40">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16 items-center">
        
        {/* Left Column: Contact details */}
        <div className="md:col-span-6 flex flex-col justify-center space-y-10">
          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight text-white leading-none">
            Contact
          </h1>
          
          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-center gap-4 text-sm sm:text-base md:text-lg text-white/90">
                <Phone className="h-7 w-7 text-white" aria-hidden="true" />
              <span className="font-semibold tracking-wide">+420 000 000 000</span>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4 text-sm sm:text-base md:text-lg text-white/90">
                <MapPin className="h-7 w-7 text-white" aria-hidden="true" />
              <span className="font-medium leading-relaxed">
                Na Plzeňce 1166/0
                <br />
                150 00
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Iframe */}
        <div className="md:col-span-6">
          <div className="relative w-full h-[320px] sm:h-[380px] md:h-[400px] overflow-hidden rounded-[32px] border border-white/5 shadow-2xl transition-transform duration-300 hover:scale-[1.01]">
            <iframe
              src="https://maps.google.com/maps?q=Na%20Plze%C5%88ce%201166/0,%20150%2000%20Praha%205-Sm%C3%ADchov,%20Czechia&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BIO CWT Location Map"
              className="absolute inset-0"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
