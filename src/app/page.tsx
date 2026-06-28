import { AboutSection } from "@/components/about-section"
import { AdvantagesSection } from "@/components/advantages-section"
import { HeroSection } from "@/components/hero-section"
import { OurWorkSection } from "@/components/our-work-section"
import { QuestionsSection } from "@/components/questions-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WoodTypesSection } from "@/components/wood-types-section"

export const dynamic = 'force-dynamic';


// Fetch CMS configurations from the NestJS backend
async function getCmsData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch( `${apiUrl}/cms`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch CMS content: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error loading CMS data:', error);
    return null; // Fallback to hardcoded defaults on error
  }
}

// Fetch dynamic wood types catalog from NestJS backend
async function getWoodTypes() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/wood-types`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch wood types: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error loading wood types data:', error);
    return null; // Fallback to hardcoded defaults on error
  }
}

export default async function Home() {
  const [cmsData, woodTypes] = await Promise.all([
    getCmsData(),
    getWoodTypes(),
  ]);

  return (
    <div className="min-h-screen bg-background bg-repeat" style={{ backgroundImage: "url('/background.png')", backgroundSize: '100% auto' }}>
      <SiteHeader />
      <main>
        <HeroSection data={cmsData?.hero} />
        <WoodTypesSection data={woodTypes} />
        <OurWorkSection data={cmsData?.ourWork} />
        <AdvantagesSection data={cmsData?.advantages} />
        <AboutSection data={cmsData?.about} />
        <QuestionsSection />
      </main>
      <SiteFooter />
    </div>
  )
}
