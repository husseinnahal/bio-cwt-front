'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import ApiClient from '@/lib/api';
import Image from 'next/image';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Tab = 'hero' | 'about' | 'advantages' | 'ourWork';

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states for each section
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', images: ['', '', ''] });
  const [aboutForm, setAboutForm] = useState({ description: '', images: ['', '', ''] });
  const [advantagesForm, setAdvantagesForm] = useState({ title: '', advantages: [''], image: '' });
  const [ourWorkForm, setOurWorkForm] = useState({ images: [{ src: '', alt: '' }] });

  useEffect(() => {
    // Fetch all current CMS settings
    const loadCmsData = async () => {
      try {
        const data: unknown = await ApiClient.get('/cms');       
        if (data.hero) {
          setHeroForm({
            title: data.hero.title || '',
            subtitle: data.hero.subtitle || '',
            images: data.hero.images || ['', '', ''],
          });
        }
        // if (data.about) {
          setAboutForm({
            description: data.about.description || '',
            images: data.about.images || ['', '', ''],
          });
        // }
        // if (data.advantages) {
          setAdvantagesForm({
            title: data.advantages.title || '',
            advantages: data.advantages.advantages || [''],
            image: data.advantages.image || '',
          });
        // }
        // if (data.ourWork) {
          setOurWorkForm({
            images: data.ourWork.images || [{ src: '', alt: '' }],
          });
        // }
      } catch (error) {
        console.error('Failed to load CMS data', error);
        showStatus('error', 'Failed to retrieve website content configurations.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCmsData();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Cloudinary image upload handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploadSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      showStatus('success', 'Uploading image to Cloudinary...');
      const token = ApiClient.getAccessToken();
      const uploadUrl = BASE_URL.endsWith('/api') ? `${BASE_URL}/cms/upload` : `${BASE_URL}/api/cms/upload`;
      const res = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.data && res.data.url) {
        onUploadSuccess(res.data.url);
        showStatus('success', 'Image uploaded successfully!');
      }
    } catch (err: any) {
      console.error('Image upload failed', err);
      showStatus('error', err.response?.data?.message || 'Failed to upload image to Cloudinary.');
    }
  };

  // Save specific section configuration
  const handleSave = async (key: Tab, value: any) => {
    // Client-side validation checks matching backend constraints
    if (key === 'hero') {
      if (!value.title?.trim()) {
        showStatus('error', 'Hero Heading Title is required.');
        return;
      }
      if (value.title.trim().length < 3) {
        showStatus('error', 'Hero Heading Title must be at least 3 characters.');
        return;
      }
      if (!value.subtitle?.trim()) {
        showStatus('error', 'Subtitle Description is required.');
        return;
      }
      if (value.images.some((img: string) => !img?.trim())) {
        showStatus('error', 'All 3 Hero Grid Images are required.');
        return;
      }
    } else if (key === 'about') {
      if (!value.description?.trim()) {
        showStatus('error', 'About Us Description is required.');
        return;
      }
      if (value.description.trim().length < 10) {
        showStatus('error', 'About Us Description must be at least 10 characters.');
        return;
      }
      if (value.images.some((img: string) => !img?.trim())) {
        showStatus('error', 'All 3 About Overlapping Grid Images are required.');
        return;
      }
    } else if (key === 'advantages') {
      if (!value.title?.trim()) {
        showStatus('error', 'Advantages Heading Title is required.');
        return;
      }
      if (value.title.trim().length < 3) {
        showStatus('error', 'Advantages Heading Title must be at least 3 characters.');
        return;
      }
      if (value.advantages.some((bullet: string) => !bullet?.trim())) {
        showStatus('error', 'All advantage bullets must be filled in.');
        return;
      }
      if (!value.image?.trim()) {
        showStatus('error', 'Section Highlight Image is required.');
        return;
      }
    } else if (key === 'ourWork') {
      if (!value.images || value.images.length === 0) {
        showStatus('error', 'At least one work carousel slide is required.');
        return;
      }
      if (value.images.some((img: any) => !img.src?.trim() || !img.alt?.trim())) {
        showStatus('error', 'All carousel slides must have both an image and an alt description.');
        return;
      }
    }

    setIsSaving(true);
    try {
      await ApiClient.put(`/cms/${key}`, value);
      showStatus('success', 'Content updated and published successfully!');
    } catch (err: any) {
      console.error('Failed to save CMS data', err);
      showStatus('error', err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/80 border-t-white animate-spin"></div>
          </div>
          <p className="text-white text-sm animate-pulse">Loading CMS Configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Title block */}
      <div className="flex items-center justify-between flex-wrap gap-1 gap-y-5 mb-8">
        <div>
          <h1 className="text-lg md:text-3xl font-kyiv text-foreground tracking-tight">Website Content CMS</h1>
          <p className="text-foreground/80 text-xs md:text-sm mt-1">Manage public website and images.</p>
        </div>
        <Link
          href="/dashboard"
          className="px-2  md:px-4 py-2 text-xs font-semibold rounded-xl border border-border text-[#8ba393] hover:text-white hover:bg-inputansition"
        >
          Back to Overview
        </Link>
      </div>



      {/* CMS Tab bar Navigation */}
      <div className="flex justify-center border-b border-foreground/50 mb-8 overflow-x-auto gap-1 sm:gap-2">
        {(['hero', 'about', 'advantages', 'ourWork'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={` px-2 md:px-6 py-3.5 text-xs sm:text-sm font-semibold border-b-2 capitalize transition-all shrink-0 ${
              activeTab === tab
                ? 'border-foreground text-secondary-foreground'
                : 'border-transparent text-[#8ba393] hover:text-white'
            }`}
          >
            {tab === 'ourWork' ? 'Our Work' : tab}
          </button>
        ))}
      </div>

      {/* Editor Content Panels */}
      <div className="bg-card/80 border border-border/60 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        
        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave('hero', heroForm);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Hero Heading Title
              </label>
              <textarea
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                placeholder="Solid&#10;Wood&#10;Products"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-input border-[2px] border-border  text-[#32353C] placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7]  outline-none transition duration-300"
              />
              <span className="text-[10px] text-[#6b7c70] mt-1 block">Use newlines (enter keys) to break title formatting columns</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Subtitle Description
              </label>
              <input
                type="text"
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                placeholder="Oak, beech, ash from 1700 CZK per m3"
                className="w-full px-4 py-3 rounded-xl bg-input border-[2px] border-border  text-[#32353C] placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7]  outline-none transition duration-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                Hero Grid Images (3 Required)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {heroForm.images.map((imgUrl, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="text-xs text-foreground">Image slot {idx + 1}</span>
                    <div className="relative aspect-square w-full rounded-2xl border border-border bg-input overflow-hidden flex items-center justify-center">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" width={100} height={100} />
                      ) : (
                        <span className="text-xs text-[#4d5e53]">No image uploaded</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e, (uploadedUrl) => {
                          const newImages = [...heroForm.images];
                          newImages[idx] = uploadedUrl;
                          setHeroForm({ ...heroForm, images: newImages });
                        })
                      }
                      className="text-xs text-foreground w-full file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-wh file:text-primary hover:file:bg-primary hover:file:text-white file:transition cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
                className=" px-[30px] md:px-button-x py-button-y  rounded-lg  bg-primary text-primary-foreground  font-inter hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 cursor-pointer"
            >
              {isSaving ? 'Publishing...' : 'Save & Publish Hero'}
            </button>
          </form>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave('about', aboutForm);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                About Us Description Block
              </label>
              <textarea
                value={aboutForm.description}
                onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                rows={6}
                placeholder="BIO CWT — We manufacture solid wood products..."
                className="w-full px-4 py-3 rounded-xl bg-input border-[2px] border-border  text-[#32353C] placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7]  outline-none transition duration-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                About Overlapping Grid Images (3 Required)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aboutForm.images.map((imgUrl, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="text-xs text-foreground">Image slot {idx + 1}</span>
                    <div className="relative aspect-[4/3] w-full rounded-2xl border border-border bg-input overflow-hidden flex items-center justify-center">
                      {imgUrl ? (
                        <Image width={100} height={100} src={imgUrl} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-xs text-[#4d5e53]">No image uploaded</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e, (uploadedUrl) => {
                          const newImages = [...aboutForm.images];
                          newImages[idx] = uploadedUrl;
                          setAboutForm({ ...aboutForm, images: newImages });
                        })
                      }
                        className="w-full px-4 py-3 rounded-xl bg-input border-[2px] border-border  text-[#32353C] placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7]  outline-none transition duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
                className="px-[30px] md:px-button-x py-button-y  rounded-lg  bg-primary text-primary-foreground  font-inter hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 cursor-pointer"
            >
              {isSaving ? 'Publishing...' : 'Save & Publish About'}
            </button>
          </form>
        )}

        {/* ADVANTAGES TAB */}
        {activeTab === 'advantages' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave('advantages', advantagesForm);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs font-semibold text-[#8ba393] uppercase tracking-wider mb-2">
                Advantages Heading Title
              </label>
              <textarea
                value={advantagesForm.title}
                onChange={(e) => setAdvantagesForm({ ...advantagesForm, title: e.target.value })}
                placeholder="Advantages&#10;Working With Us"
                rows={2}
                
                className="w-full px-4 py-3 rounded-xl bg-input border-[2px] border-border  text-[#32353C] placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7]  outline-none transition duration-300"
              />
              <span className="text-[10px] text-[#6b7c70] mt-1 block">Use newlines (enter keys) to break title lines</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#8ba393] uppercase tracking-wider">
                  List of Advantages
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setAdvantagesForm({
                      ...advantagesForm,
                      advantages: [...advantagesForm.advantages, ''],
                    })
                  }
                  className="px-2.5 py-1 text-[10px] font-bold bg-[#202722] text-[#3b8450] border border-[#3b8450]/30 hover:bg-[#3b8450] hover:text-white rounded-lg transition"
                >
                  + Add Bullet
                </button>
              </div>
              <div className="space-y-3">
                {advantagesForm.advantages.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const list = [...advantagesForm.advantages];
                        list[idx] = e.target.value;
                        setAdvantagesForm({ ...advantagesForm, advantages: list });
                      }}
                      placeholder={`Bullet item ${idx + 1}`}
                      className="w-full px-4 py-3 rounded-xl bg-input border-[2px] border-border  text-[#32353C] placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7]  outline-none transition duration-300"
                    />
                    {advantagesForm.advantages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const list = advantagesForm.advantages.filter((_, i) => i !== idx);
                          setAdvantagesForm({ ...advantagesForm, advantages: list });
                        }}
                        className="px-3 py-2.5 text-xs text-red-400 bg-red-950/20 hover:bg-red-950/40 rounded-xl transition border border-red-900/30"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8ba393] uppercase tracking-wider mb-2">
                Section Highlight Image (1 Required)
              </label>
              <div className="flex items-start gap-6 flex-wrap">
                <div className="relative aspect-[4/3] w-48 rounded-2xl border border-border bg-input overflow-hidden flex items-center justify-center shrink-0">
                  {advantagesForm.image ? (
                    <Image src={advantagesForm.image} alt="Preview" className="object-cover w-full h-full" width={100} height={100} />
                  ) : (
                    <span className="text-xs text-[#4d5e53]">No image uploaded</span>
                  )}
                </div>
                <div className="space-y-3 pt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (uploadedUrl) => {
                        setAdvantagesForm({ ...advantagesForm, image: uploadedUrl });
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-input border-[2px] border-border  text-[#32353C] placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7]  outline-none transition duration-300"
                  />
                  <p className="text-[10px] text-[#8ba393] leading-relaxed">
                    Upload a high quality staircase or custom wood product image here to represent your craft.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
                className="px-[30px] md:px-button-x py-button-y  rounded-lg  bg-primary text-primary-foreground  font-inter hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 cursor-pointer"
            >
              {isSaving ? 'Publishing...' : 'Save & Publish Advantages'}
            </button>
          </form>
        )}

        {/* PORTFOLIO SLIDESHOW TAB */}
        {activeTab === 'ourWork' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave('ourWork', ourWorkForm);
            }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#8ba393] uppercase tracking-wider">
                Slideshow Carousel Images
              </label>
              <button
                type="button"
                onClick={() =>
                  setOurWorkForm({
                    images: [...ourWorkForm.images, { src: '', alt: '' }],
                  })
                }
                className="px-2.5 py-1 text-[10px] font-bold bg-[#202722] text-[#3b8450] border border-[#3b8450]/30 hover:bg-[#3b8450] hover:text-white rounded-lg transition"
              >
                + Add Slide
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {ourWorkForm.images.map((slide, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-border bg-input flex flex-wrap  gap-6 items-start">
                  <div className="relative aspect-[16/10] w-36 rounded-xl border border-border bg-input overflow-hidden flex items-center justify-center shrink-0">
                    {slide.src ? (
                      <Image  width={100} height={100} src={slide.src} alt="Slide Preview" className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-xs text-[#4d5e53]">No image</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-[#8ba393] min-w-[50px]">Slide {idx + 1}</span>
                      {ourWorkForm.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const list = ourWorkForm.images.filter((_, i) => i !== idx);
                            setOurWorkForm({ images: list });
                          }}
                          className="text-[10px] font-bold text-red-400 hover:text-red-300 transition min-w-[70px]"
                        >
                          Remove Slide
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] text-[#8ba393] mb-1">Image File Upload</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, (uploadedUrl) => {
                              const list = [...ourWorkForm.images];
                              list[idx] = { ...list[idx], src: uploadedUrl };
                              setOurWorkForm({ images: list });
                            })
                          }
                        className="w-full px-4 py-3 rounded-xl bg-input border-[2px] border-border  text-[#32353C] placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7]  outline-none transition duration-300"
                        />
                      </div>


                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSaving}
                className="px-[30px] md:px-button-x py-button-y  rounded-lg  bg-primary text-primary-foreground  font-inter hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 cursor-pointer"
            >
              {isSaving ? 'Publishing...' : 'Save & Publish Slide Deck'}
            </button>
          </form>
          
        )}
         {/* Status Bar */}
        {statusMessage && (
          <div
            className={`mt-6 p-4 rounded-xl text-sm border ${
              statusMessage.type === 'success'
                ? 'bg-[#1b2f21]/60 border-green-800/80 text-green-300'
                : 'bg-red-950/40 border-red-800/60 text-red-300'
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
