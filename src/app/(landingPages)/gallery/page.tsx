import { OurWorkSection } from "@/components/our-work-section"
import { WoodTypesSection } from "@/components/wood-types-section"
import { QuestionsSection } from "@/components/questions-section"

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



export default async function Gallery() {
  const [cmsData, woodTypes] = await Promise.all([
    getCmsData(),
    getWoodTypes(),
  ]);

  return (
    <>
    
        <OurWorkSection data={cmsData?.ourWork} />
        <WoodTypesSection data={woodTypes} />
      <QuestionsSection/>
    </>
  )
}

















