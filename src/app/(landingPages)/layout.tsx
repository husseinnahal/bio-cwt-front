import React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function LandingPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div 
      className="min-h-screen bg-background bg-repeat" 
      style={{ backgroundImage: "url('/background.png')", backgroundSize: '100% auto' }}
    >
      <SiteHeader />
      <main className="mt-[60px]">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
