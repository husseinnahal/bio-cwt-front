'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  adminEmail?: string;
  onLogout: () => void;
}

export function Header({
  adminEmail,
  onLogout,
}: HeaderProps) {
  

  return (
    <header className="z-1000 rounded-b-[30px] px-3 py-2 bg-card backdrop-blur-md sticky top-0 font-inter">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <Image src="/logo.svg" alt="Logo" width={100} height={50} priority />
        </Link>

        <div className=" flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-3 border-r border-white/60 pr-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2a3c30] to-[#513c2c] flex items-center justify-center border border-[#3b8450]/40 text-[#e3c79a] font-semibold text-sm shadow-md">
              A
            </div>
            <div className="hidden md:block text-left">
              <span className="text-sm font-semibold text-foreground block leading-tight">
                Administrator
              </span>
              <span className="text-xs text-foreground/90 block leading-tight">
                {adminEmail}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-[17px] py-[10px] md:px-button-x md:py-button-y text-sm md:text-md rounded-lg border bg-primary text-primary-foreground font-[700] font-inter hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 flex items-center space-x-2 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
