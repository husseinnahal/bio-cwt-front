import Image from "next/image"

interface AboutSectionProps {
  data?: {
    description?: string;
    images?: string[];
  };
}

export function AboutSection({ data }: AboutSectionProps) {
  const descriptionText = data?.description || 
    "BIO CWT — We manufacture solid wood products according to individual drawings. We make chairs, armchairs, wardrobes, beds and much more in our own workshop, equipped with all the necessary industrial equipment.";
  
  const images = data?.images || [
    "/about-1.png",
    "/about-2.png",
    "/about-3.png",
  ];

  // Helper to preserve bold style on brand prefix if present
  const formatDescription = (text: string) => {
    const brandPrefix = "BIO CWT — ";
    if (text.startsWith(brandPrefix)) {
      return (
        <>
          <span className="font-semibold text-white">BIO CWT</span> — {text.substring(brandPrefix.length)}
        </>
      );
    }
    const standardPrefix = "BIO CWT - ";
    if (text.startsWith(standardPrefix)) {
      return (
        <>
          <span className="font-semibold text-white">BIO CWT</span> — {text.substring(standardPrefix.length)}
        </>
      );
    }
    return text;
  };

  return (
    <section id="about" className="relative w-full min-h-[720px]  md:min-h-[720px] max-w-7xl pr-5 py-16 md:py-24">
      {/* Dark brown about card */}
      <div className=" rounded-r-[26px] bg-card border w-[95%]  sm:w-[90%] border-white/5 px-4 py-6  md:pl-3 sm:px-4  sm:py-10 md:px-6 md:py-14  shadow-2xl">
        <div className="flex gap-10 items-start justify-center flex-wrap ">
          
          {/* Left Column: Text Content */}
          <div className=" flex flex-col items-start justify-start max-w-[350px]  " >
          <h2 className="font-heading text-2xl uppercase leading-[1.05] tracking-tight sm:text-4xl md:text-5xl text-foreground ">
              About Us
            </h2>
            <p className="mt-6  leading-relaxed text-sm sm:text-md text-foreground font-medium max-w-md  ">
              {formatDescription(descriptionText)}
            </p>
          </div> 

          {/* Right Column: Triple Image Cluster */}
          <div className="flex items-center justify-center  w-full min-w-[300px] max-w-[30%]">
            {/* Desktop Cluster (md and up) */}
            <div className="relative hidden sm:block h-[340px] w-full max-w-[420px]">
              {/* Left Main Image: smiling carpenter (vertical) */}
              <div className="absolute left-0 z-30 top-[30px] h-[220px] w-[220px] overflow-hidden rounded-[24px] border-4 border-[#1E0C06] shadow-2xl">
                <Image 
                  src={images[0] || "/about-1.png"} 
                  alt="Carpenter handling timber" 
                  fill 
                  className="object-cover" 
                />
              </div>
              {/* Top Right: hands working (square) */}
              <div className="absolute right-0 -top-10 h-[140px] w-[140px] overflow-hidden rounded-[24px] border-4 border-[#1E0C06] shadow-2xl z-10">
                <Image 
                  src={images[1] || "/about-2.png"} 
                  alt="Carpenter in the workshop" 
                  fill 
                  className="object-cover" 
                />
              </div>
              {/* Bottom Right: drawing (horizontal) */}
              <div className="absolute right-0 -bottom-[45px] h-[140px] w-[140px] overflow-hidden rounded-[24px] border-4 border-[#1E0C06] shadow-2xl z-20">
                <Image 
                  src={images[2] || "/about-3.png"} 
                  alt="Reviewing furniture drawings" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* Mobile Cluster */}
            <div className="relative block sm:hidden h-[260px] w-full max-w-[280px]">
              {/* Left Main Image */}
              <div className="absolute z-30 left-2 top-[30px] h-[150px] w-[150px] overflow-hidden rounded-[20px] border-4 border-[#1E0C06] shadow-xl">
                <Image 
                  src={images[0] || "/about-1.png"} 
                  alt="Carpenter smiling" 
                  fill 
                  className="object-cover" 
                />
              </div>
              {/* Top Right */}
              <div className="absolute right-[50px] top-0 h-[100px] w-[100px] overflow-hidden rounded-[20px] border-4 border-[#1E0C06] shadow-xl z-10">
                <Image 
                  src={images[1] || "/about-2.png"} 
                  alt="Carpenter hands" 
                  fill 
                  className="object-cover" 
                />
              </div>
              {/* Bottom Right */}
              <div className="absolute right-[40px] -bottom-[20px] h-[100px] w-[100px] overflow-hidden rounded-[20px] border-4 border-[#1E0C06] shadow-xl z-20">
                <Image 
                  src={images[2] || "/about-3.png"} 
                  alt="Furniture drawing" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  )
}
