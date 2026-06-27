'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiClient from '@/lib/api';
import {Header} from './components/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      // Direct redirect to login if no authentication credentials are found
      if (!ApiClient.getAccessToken() && !ApiClient.getRefreshToken()) {
        router.push('/login');
        return;
      }

      try {
        const userData = await ApiClient.get('/users/me');
        setAdmin(userData);
      } catch (error) {
        console.error('Failed to load profile', error);
        ApiClient.clearTokens();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [router]);

  const handleLogout = async () => {
    try {
      await ApiClient.post('/auth/logout', {});
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      ApiClient.clearTokens();
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-inter px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/80 border-t-white animate-spin"></div>
          </div>
          <p className="text-foreground text-sm tracking-wide animate-pulse">
            Loading dashboard environment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background text-foreground flex flex-col font-inter relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/back.svg')",backgroundPosition:"center",backgroundRepeat:"no-repeat",backgroundSize:"cover" }}
    >

      {/* Header */}
      <Header
        adminEmail={admin?.email}
        onLogout={handleLogout}
      />

      {/* Main Content Container */}
      <main className="z-10 flex-1 max-w-7xl w-full mx-auto py-10 px-4 md:px-6 ">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Pass admin data to nested pages as a prop
            return React.cloneElement(child, { admin } as any);
          }
          return child;
        })}
      </main>
    </div>
  );
}
