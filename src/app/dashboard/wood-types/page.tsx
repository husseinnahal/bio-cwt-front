'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Plus, Trash2, Edit2, Check, X, ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import ApiClient from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Feature {
  label: string;
  positive: boolean;
}

interface WoodProduct {
  id: string;
  name: string;
  image: string;
  features: Feature[];
}

export default function WoodTypesManager() {
  const [products, setProducts] = useState<WoodProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formFeatures, setFormFeatures] = useState<Feature[]>([{ label: '', positive: true }]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Load products list from backend
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data: any = await ApiClient.get('/wood-types');
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to load wood types', err);
      showStatus('error', 'Failed to retrieve wood types directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Open creation form
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormImage('');
    setSelectedFile(null);
    setPreviewUrl('');
    setFormFeatures([{ label: '', positive: true }]);
    setIsFormOpen(true);
  };

  // Open update form
  const handleOpenEdit = (product: WoodProduct) => {
    setEditingId(product.id);
    setFormName(product.name);
    setFormImage(product.image);
    setSelectedFile(null);
    setPreviewUrl(product.image);
    setFormFeatures(product.features.length > 0 ? product.features : [{ label: '', positive: true }]);
    setIsFormOpen(true);
  };

  // Local image uploader handler (saves to state, doesn't post to Cloudinary instantly)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Add a new empty feature row
  const addFeatureRow = () => {
    setFormFeatures([...formFeatures, { label: '', positive: true }]);
  };

  // Remove a feature row
  const removeFeatureRow = (index: number) => {
    if (formFeatures.length <= 1) return;
    setFormFeatures(formFeatures.filter((_, idx) => idx !== index));
  };

  // Edit value in a feature row
  const updateFeatureRow = (index: number, field: keyof Feature, value: any) => {
    const list = [...formFeatures];
    list[index] = { ...list[index], [field]: value };
    setFormFeatures(list);
  };

  // Submit handler (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (!formName.trim()) {
      showStatus('error', 'name is required.');
      return;
    }
    if (formName.trim().length < 3) {
      showStatus('error', ' name must be at least 3 characters.');
      return;
    }
    if (!selectedFile && !formImage.trim()) {
      showStatus('error', 'Image is required.');
      return;
    }
    if (formFeatures.some(f => !f.label.trim())) {
      showStatus('error', 'All feature bullets must have descriptions filled.');
      return;
    }

    setIsSaving(true);

    const formData = new FormData();
    formData.append('name', formName);
    formData.append('features', JSON.stringify(formFeatures));
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    } else {
      formData.append('image', formImage); // string URL of existing image
    }

    try {
      if (editingId) {
        // Update action with multipart/form-data
        await ApiClient.put(`/wood-types/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showStatus('success', 'Wood type updated successfully!');
      } else {
        // Create action with multipart/form-data
        await ApiClient.post('/wood-types', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showStatus('success', 'Wood type created successfully!');
      }
      setIsFormOpen(false);
      loadProducts();
    } catch (err: any) {
      console.error('Failed to save wood product', err);
      showStatus('error', err.message || 'Failed to save product changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the product list?`)) return;

    try {
      await ApiClient.delete(`/wood-types/${id}`);
      showStatus('success', `Product "${name}" deleted successfully.`);
      loadProducts();
    } catch (err: any) {
      console.error('Failed to delete wood type', err);
      showStatus('error', err.message || 'Failed to delete product.');
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/80 border-t-white animate-spin"></div>
          </div>
          <p className="text-white text-sm animate-pulse">Loading Wood Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Header section */}
      <div className="flex items-center justify-between  gap-4 md:gap-6 mb-8 flex-wrap">
        <div>
          <h1 className="text-lg md:text-3xl font-kyiv text-foreground tracking-tight">Wood Catalog Manager</h1>
          <p className="text-foreground/85 text-xs md:text-sm mt-1">Manage species and qualities of timber displayed on landing pages.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-border text-[#8ba393] hover:text-white hover:bg-input flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Overview
          </Link>
          {!isFormOpen && (
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground flex items-center gap-1.5 transition shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Wood Product
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm border ${
            statusMessage.type === 'success'
              ? 'bg-[#1b2f21]/60 border-green-800/80 text-green-300'
              : 'bg-red-950/40 border-red-800/60 text-red-300'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Accordion / Drawer Form */}
      {isFormOpen && (
        <div className="bg-card/80 border border-border/60 rounded-3xl p-6 md:p-8 backdrop-blur-md mb-8 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-border/60 pb-3">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              {editingId ? 'Edit Wood Product' : 'Add New Wood Product'}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-[#8ba393] hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Info */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Wood Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Cherry, Walnut, Maple"
                    className="w-full px-4 py-3 rounded-xl bg-input border-[2px] border-border text-[#32353C] placeholder-[#D9D9D982] placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7] outline-none transition duration-300 "
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Wood Image
                  </label>
                  <div className="flex items-center gap-4 justify-center">
                    <div className="relative aspect-square w-24 rounded-2xl border border-border bg-input overflow-hidden flex items-center justify-center shrink-0">
                      {previewUrl ? (
                        <Image src={previewUrl} alt="Wood sample upload" fill className="object-cover" />
                      ) : (
                        <span className="text-xs text-[#4d5e53]">No sample</span>
                      )}
                    </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-xs text-foreground w-full file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-primary hover:file:bg-primary hover:file:text-white file:transition cursor-pointer"
                      />

                  </div>
                </div>
              </div>

              {/* Qualities / Features List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Timber Qualities / Features
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureRow}
                    className="px-2.5 py-1 text-[10px] font-bold bg-[#202722] text-[#3b8450] border border-[#3b8450]/30 hover:bg-[#3b8450] hover:text-white rounded-lg transition"
                  >
                    + Add Quality
                  </button>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {formFeatures.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-input/40 p-2.5 rounded-xl border border-border/40">
                      <input
                        type="text"
                        value={feat.label}
                        onChange={(e) => updateFeatureRow(idx, 'label', e.target.value)}
                        placeholder="e.g. Durability, High water resistance"
                        className="flex-1 min-w-0 px-3 py-1.5 bg-input border border-border text-[#32353C] placeholder-[#D9D9D982] text-xs rounded-lg placeholder-[#D9D9D982] [&:not(:placeholder-shown)]:border-[#6C200B] [&:not(:placeholder-shown)]:bg-[#A3B8D7] outline-none transition duration-300"
                      />

                      <button
                        type="button"
                        onClick={() => updateFeatureRow(idx, 'positive', !feat.positive)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border shrink-0 ${
                          feat.positive
                            ? 'bg-green-950/20 border-green-800/40 text-green-400'
                            : 'bg-red-950/20 border-red-800/40 text-red-400'
                        }`}
                      >
                        {feat.positive ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            Good
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 text-red-400" />
                            Bad
                          </>
                        )}
                      </button>

                      {formFeatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureRow(idx)}
                          className="p-1.5 text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded-lg transition shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border/60 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4  md:px-button-x py-button-y text-xs font-semibold rounded-lg border border-border text-[#8ba393] hover:text-white hover:bg-input transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-3 md:px-button-x py-button-y rounded-lg bg-primary text-primary-foreground font-inter hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Publish Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products list grid */}
      {products.length === 0 ? (
        <div className="text-center p-12 bg-card/40 border border-border/60 rounded-3xl backdrop-blur-sm">
          <AlertTriangle className="w-12 h-12 text-yellow-600/80 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Catalog Empty</h3>
          <p className="text-xs text-[#8ba393] max-w-sm mx-auto mb-6">
            No wood products found in the database. Add your first wood product to start showing them on your public home page!
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground transition shadow-md"
          >
            Add Wood Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-5 rounded-3xl bg-card/80 border border-border/60 backdrop-blur-md hover:border-[#3b8450]/40 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/60 bg-input mb-4 shadow-inner">
                  <Image src={product.image || "/placeholder.svg"} alt={`${product.name} sample`} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{product.name}</h3>

                {/* Qualities bullet overview */}
                <ul className="space-y-1.5 border-t border-border/40 pt-3">
                  {product.features.map((feat, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-[#8ba393]">
                      {feat.positive ? (
                        <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                      <span className="truncate">{feat.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 border-t border-border/40 pt-4 mt-6">
                <button
                  onClick={() => handleOpenEdit(product)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold border border-border text-[#8ba393] hover:text-white hover:bg-input transition flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 hover:border-red-800 transition flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
