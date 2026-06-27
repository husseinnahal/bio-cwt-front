import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className=" h-[100vh] max-h-screen   bg-background"
        style={{ backgroundImage: "url('/back.svg')",backgroundPosition:"center",backgroundRepeat:"no-repeat",backgroundSize:"cover" }}
    >
      <div className="w-[80%] md:w-[60%] h-[80%] md:h-full"
              style={{ backgroundImage: "url('/hero-img.png')",backgroundPosition:"center",backgroundRepeat:"no-repeat",backgroundSize:"cover" }}
      >
      </div>

      <div className="w-full h-full absolute top-0 flex flex-col items-center justify-center  px-6 text-center">

                <Image
                  src="/404.svg"
                  alt="404 page not found"
                  width={600}
                  height={350}
                  className="h-auto w-72 md:w-[55%] "
                  priority
                />
                <h1 className="mt-8 md:mt-6 font-kyiv text-4xl md:text-6xl  tracking-tight">
                  Woops    
                </h1>
                <p className="mt-5 max-w-sm text-sm md:text-lg leading-relaxed text-foreground">
                  Oh, you must be lost,
                  there is no such page.     
                </p>
                <Button  className="mt-8 rounded-full px-8">
                  <Link href="/">Go to the home page</Link>
                </Button>

      </div>

    </main>
  )
}
