'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2, ArrowLeft, Save, AlertTriangle, X, Check, Calculator } from 'lucide-react';
import ApiClient from '@/lib/api';

interface PriceRow {
  length: number;
  width: number;
  thickness: number;
  cubicMeter: number;
  pricePerM3: number;
  pricePerPiece: number;
}

interface Service {
  id: string;
  name: string;
  prices: PriceRow[];
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPrices, setFormPrices] = useState<PriceRow[]>([
    { length: 1000, width: 300, thickness: 40, cubicMeter: 0.012, pricePerM3: 1100, pricePerPiece: 462 }
  ]);

  // Load services from backend
  const loadServices = async () => {
    setIsLoading(true);
    try {
      const data: any = await ApiClient.get('/services');
      setServices(data);
    } catch (err: any) {
      console.error('Failed to load services', err);
      showStatus('error', 'Failed to retrieve services catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormPrices([
      { length: 1000, width: 300, thickness: 40, cubicMeter: 0.012, pricePerM3: 1100, pricePerPiece: 462 }
    ]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingId(service.id);
    setFormName(service.name);
    setFormPrices(
      service.prices.length > 0
        ? [...service.prices]
        : [{ length: 1000, width: 300, thickness: 40, cubicMeter: 0.012, pricePerM3: 1100, pricePerPiece: 462 }]
    );
    setIsFormOpen(true);
  };

  // Pricing matrix row management with auto-calculations
  const handlePriceRowChange = (index: number, field: keyof PriceRow, val: any) => {
    const list = [...formPrices];
    const currentRow = { ...list[index] };

    // Update field value
    currentRow[field] = val;

    // Auto-calculate Cubic Meter volume: L * W * T / 1,000,000,000
    if (field === 'length' || field === 'width' || field === 'thickness') {
      const l = field === 'length' ? val : currentRow.length;
      const w = field === 'width' ? val : currentRow.width;
      const t = field === 'thickness' ? val : currentRow.thickness;

      if (l && w && t) {
        // Round to 6 decimal places to prevent float precision issues
        currentRow.cubicMeter = Math.round(((l * w * t) / 1000000000) * 1000000) / 1000000;
        
        // Also update price per piece if pricePerM3 is already set
        if (currentRow.pricePerM3) {
          currentRow.pricePerPiece = Math.round(currentRow.cubicMeter * currentRow.pricePerM3 * 10) / 10;
        }
      }
    }

    // Auto-calculate Price per Piece: cubicMeter * pricePerM3
    if (field === 'pricePerM3' || field === 'cubicMeter') {
      const m3 = field === 'cubicMeter' ? val : currentRow.cubicMeter;
      const rate = field === 'pricePerM3' ? val : currentRow.pricePerM3;

      if (m3 !== undefined && rate !== undefined) {
        currentRow.pricePerPiece = Math.round(m3 * rate * 10) / 10;
      }
    }

    list[index] = currentRow;
    setFormPrices(list);
  };

  const addPriceRow = () => {
    // Add default row or duplicate the last row's structure for faster entries
    const lastRow = formPrices[formPrices.length - 1];
    setFormPrices([
      ...formPrices,
      lastRow
        ? { ...lastRow }
        : { length: 1000, width: 300, thickness: 40, cubicMeter: 0.012, pricePerM3: 1100, pricePerPiece: 462 }
    ]);
  };

  const removePriceRow = (index: number) => {
    if (formPrices.length <= 1) return;
    setFormPrices(formPrices.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showStatus('error', 'Service category name is required.');
      return;
    }

    // Row-level validations
    for (let i = 0; i < formPrices.length; i++) {
      const row = formPrices[i];
      if (!row.length || row.length <= 0 || !row.width || row.width <= 0 || !row.thickness || row.thickness <= 0) {
        showStatus('error', `Row ${i + 1} has invalid dimensions. They must be positive numbers.`);
        return;
      }
      if (row.cubicMeter <= 0 || row.pricePerM3 < 0 || row.pricePerPiece < 0) {
        showStatus('error', `Row ${i + 1} has invalid calculated values. They must be positive.`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        prices: formPrices.map((row) => ({
          length: parseInt(row.length.toString()),
          width: parseInt(row.width.toString()),
          thickness: parseInt(row.thickness.toString()),
          cubicMeter: parseFloat(row.cubicMeter.toString()),
          pricePerM3: parseFloat(row.pricePerM3.toString()),
          pricePerPiece: parseFloat(row.pricePerPiece.toString()),
        })),
      };

      if (editingId) {
        await ApiClient.put(`/services/${editingId}`, payload);
        showStatus('success', 'Service category updated successfully!');
      } else {
        await ApiClient.post('/services', payload);
        showStatus('success', 'Service category created successfully!');
      }
      setIsFormOpen(false);
      loadServices();
    } catch (err: any) {
      console.error('Failed to save service', err);
      showStatus('error', err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete service category "${name}"?`)) return;

    try {
      await ApiClient.delete(`/services/${id}`);
      showStatus('success', `Service category "${name}" deleted successfully.`);
      loadServices();
    } catch (err: any) {
      console.error('Failed to delete service', err);
      showStatus('error', err.message || 'Failed to delete service category.');
    }
  };

  if (isLoading && services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/80 border-t-white animate-spin"></div>
          </div>
          <p className="text-white text-sm animate-pulse">Loading Services Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-lg md:text-3xl font-kyiv text-foreground tracking-tight">Services & Pricing Manager</h1>
          <p className="text-foreground/80 text-xs md:text-sm mt-1">Manage workshop services and volumetric matrix grids.</p>
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
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Service Product
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
        <div className="bg-card/85 border border-border/60 rounded-3xl p-6 md:p-8 backdrop-blur-md mb-8 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-border/60 pb-3">
            <h2 className="text-md md:text-xl font-bold text-foreground">
              {editingId ? 'Edit Service & Pricing Matrix' : 'Add New Service Category'}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-[#8ba393] hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Service Category Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Buk pr, Dub rustik, Carpenter Work"
                className="w-full max-w-md px-4 py-2.5 rounded-xl bg-input border border-border text-foreground placeholder-muted-foreground/60 outline-none focus:border-primary transition text-sm"
              />
            </div>

            {/* Price Matrix Editor */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Pricing Rows Grid</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Calculations run dynamically as you type length/width/thickness or m³ values. You can still manually override them.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addPriceRow}
                  className="px-3 py-1.5 min-w-[100px] text-xs font-bold bg-[#202722] text-[#3b8450] border border-[#3b8450]/30 hover:bg-[#3b8450] hover:text-white rounded-lg transition cursor-pointer"
                >
                  + Add Row
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/40">
                <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/40 font-semibold text-foreground/80">
                      <th className="p-3">délka</th>
                      <th className="p-3">šiřka</th>
                      <th className="p-3">tloustka</th>
                      <th className="p-3 flex items-center gap-1">
                        m3 <Calculator className="w-3 h-3 text-[#3b8450]" />
                      </th>
                      <th className="p-3">cena m3</th>
                      <th className="p-3">cena ks.</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {formPrices.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        {/* Length */}
                        <td className="px-1 py-2 md:p-2">
                          <input
                            type="number"
                            required
                            min="1"
                            value={row.length || ''}
                            onChange={(e) => handlePriceRowChange(idx, 'length', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-[#141816]/60 border border-border/30 rounded-lg text-foreground text-xs outline-none focus:border-primary"
                          />
                        </td>
                        {/* Width */}
                        <td className="px-1 py-2 md:p-2">
                          <input
                            type="number"
                            required
                            min="1"
                            value={row.width || ''}
                            onChange={(e) => handlePriceRowChange(idx, 'width', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-[#141816]/60 border border-border/30 rounded-lg text-foreground text-xs outline-none focus:border-primary"
                          />
                        </td>
                        {/* Thickness */}
                        <td className="px-1 py-2 md:p-2">
                          <input
                            type="number"
                            required
                            min="1"
                            value={row.thickness || ''}
                            onChange={(e) => handlePriceRowChange(idx, 'thickness', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-[#141816]/60 border border-border/30 rounded-lg text-foreground text-xs outline-none focus:border-primary"
                          />
                        </td>
                        {/* Cubic Meter */}
                        <td className="px-1 py-2 md:p-2">
                          <input
                            type="number"
                            required
                            step="any"
                            min="0.000001"
                            value={row.cubicMeter || ''}
                            onChange={(e) => handlePriceRowChange(idx, 'cubicMeter', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-[#141816]/60 border border-border/30 rounded-lg text-foreground text-xs font-mono outline-none focus:border-primary"
                          />
                        </td>
                        {/* Price per m3 */}
                        <td className="px-1 py-2 md:p-2">
                          <input
                            type="number"
                            required
                            step="any"
                            min="0"
                            value={row.pricePerM3 || ''}
                            onChange={(e) => handlePriceRowChange(idx, 'pricePerM3', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-[#141816]/60 border border-border/30 rounded-lg text-foreground text-xs outline-none focus:border-primary"
                          />
                        </td>
                        {/* Price per piece */}
                        <td className="px-1 py-2 md:p-2">
                          <input
                            type="number"
                            required
                            step="any"
                            min="0"
                            value={row.pricePerPiece || ''}
                            onChange={(e) => handlePriceRowChange(idx, 'pricePerPiece', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-[#141816]/60 border border-border/30 rounded-lg text-[#e3c79a] font-bold text-xs outline-none focus:border-primary"
                          />
                        </td>
                        {/* Delete row action */}
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            disabled={formPrices.length <= 1}
                            onClick={() => removePriceRow(idx)}
                            className="p-1.5 text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-800 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex justify-end gap-3 border-t border-border/60 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-border text-[#8ba393] hover:text-white hover:bg-input transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 md:px-button-x py-button-y rounded-lg bg-primary text-primary-foreground font-inter hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid List */}
      {services.length === 0 ? (
        <div className="text-center p-12 bg-card/40 border border-border/60 rounded-3xl backdrop-blur-sm">
          <AlertTriangle className="w-12 h-12 text-yellow-600/80 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Catalog Empty</h3>
          <p className="text-xs text-[#8ba393] max-w-sm mx-auto mb-6">
            No dynamic services catalog entries found in the database. Create your first pricing grid to publish it to the landing page pricing matrix widget.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground transition shadow-md cursor-pointer"
          >
            Add Service Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-3xl bg-card/85 border border-border/60 backdrop-blur-md hover:border-[#3b8450]/40 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-border/40 pb-3">
                  <h3 className="text-lg font-bold text-white">{service.name}</h3>
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    {service.prices.length} Pricing Matrices
                  </span>
                </div>

                <div className="overflow-x-auto max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 text-muted-foreground">
                        <th className="pb-2 font-medium">Size (mm)</th>
                        <th className="pb-2 font-medium">Vol (m³)</th>
                        <th className="pb-2 font-medium">Price/m³</th>
                        <th className="pb-2 font-medium text-right">Price/Pc</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10 text-foreground/80 font-mono">
                      {service.prices.slice(0, 5).map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          <td className="py-1.5">{row.length}x{row.width}x{row.thickness}</td>
                          <td className="py-1.5">{row.cubicMeter.toFixed(4)}</td>
                          <td className="py-1.5">{row.pricePerM3} Kč</td>
                          <td className="py-1.5 text-right font-bold text-[#e3c79a]">{row.pricePerPiece} Kč</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {service.prices.length > 5 && (
                    <div className="text-center text-[10px] text-muted-foreground mt-2 italic">
                      + {service.prices.length - 5} more dimension rows
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 border-t border-border/40 pt-4 mt-6">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold border border-border text-[#8ba393] hover:text-white hover:bg-input transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Matrix
                </button>
                <button
                  onClick={() => handleDelete(service.id, service.name)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 hover:border-red-800 transition flex items-center justify-center cursor-pointer"
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
