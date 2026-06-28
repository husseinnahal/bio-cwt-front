import { AboutSection } from "@/components/about-section"
import { OurWorkSection } from "@/components/our-work-section"
import { QuestionsSection } from "@/components/questions-section"

export const dynamic = 'force-dynamic';


// Fetch CMS configurations from the NestJS backend
async function getCmsData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/cms`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch CMS content: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error loading CMS data:', error);
    return null; // Fallback to hardcoded defaults on error
  }
}

export default async function AboutUsPage() {
  const cmsData = await getCmsData();

  return (
    <>
      <AboutSection data={cmsData?.about} />
      <OurWorkSection data={cmsData?.ourWork} />
      <QuestionsSection />
    </>
  )
}
