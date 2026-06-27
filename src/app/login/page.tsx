'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiClient from '@/lib/api';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If we have an active access token or a refresh token cookie, redirect to dashboard
    if (ApiClient.getAccessToken() || ApiClient.getRefreshToken()) {
      router.push('/dashboard');
    }
  }, [router]);

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setApiError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await ApiClient.post('/auth/login', { email, password });
      ApiClient.setTokens(data.access_token, data.refresh_token);
      router.push('/dashboard');
    } catch (err: any) {
      setApiError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" py-10 px-4 md:px-6 relative min-h-screen flex items-center justify-center bg-background overflow-hidden font-inter"
          style={{ backgroundImage: "url('/back.svg')",backgroundPosition:"center",backgroundRepeat:"no-repeat",backgroundSize:"cover" }}

    >

      <div className="w-full max-w-md p-1 z-10">
          {/* Main Card */}
          <div className="bg-card/90 rounded-3xl p-8 md:p-10 flex flex-col text-foreground">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl  mb-4 ">
                 <Image src="/logo.svg" alt="Logo" width={100} height={50} priority />
              </div>

              <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin Portal</h1>
              <p className="text-foreground/80 text-sm mt-2">Wood Product Services Control Panel</p>
            </div>

            {/* Error Message */}
            {apiError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-start space-x-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{apiError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="relative">
                <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@wood.com"
                    className={`w-full  px-4 py-3 rounded-lg bg-input text-[#32353C] border-[2px] border-border  placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7] outline-none transition duration-300`}
                  />
                </div>
                {emailError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center space-x-1">
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full  px-4 py-3 rounded-lg bg-input text-[#32353C] border-[2px] border-border  placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7] outline-none transition duration-300`}
                  />
                </div>
                {passwordError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center space-x-1">
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="px-button-x py-button-y w-full text-center rounded-lg  bg-primary text-primary-foreground font-[700] font-inter hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 cursor-pointer"

              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>
      </div>
    </div>
  );
}
