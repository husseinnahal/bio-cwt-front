import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { StoreProvider } from "@/store/provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const kyivTypeSans = localFont({
  src: "./fonts/KyivTypeSans-Medium.otf",
  variable: "--font-kyiv",
});

export const metadata: Metadata = {
  title: 'BIO CWT — Solid Wood Products',
  description:
    'BIO CWT manufactures solid wood products according to individual drawings. Oak, beech and ash from 1700 CZK per m3.',
  generator: 'Pixel38',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${kyivTypeSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
