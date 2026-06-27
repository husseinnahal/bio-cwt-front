"use client"

import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "Prices for services", href: "/services" },
  { label: "About us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-6 md:py-6">
        <Link href="/" aria-label="BIO CWT home" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="BIO CWT logo"
            width={64}
            height={28}
            // style={{ height: "auto" }}
            className="h-[45px] md:h-[55px] w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-foreground/90">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-foreground md:hidden"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav aria-label="Mobile" className="md:hidden">
          <ul className="mx-5 rounded-2xl bg-card/95 p-4 text-sm text-foreground/90 shadow-xl backdrop-blur">
            {navLinks.map((link) => (
              <li key={link.label} className="border-b border-border/60 last:border-0">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
