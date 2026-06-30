/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Award } from 'lucide-react';
import { DashboardStats } from '../types';

interface HeroProps {
  onScrollToCatalog: () => void;
}

export default function Hero({ onScrollToCatalog }: HeroProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 16,
    availableItems: 300,
    rentedItems: 0,
    totalTransactions: 0,
    totalCustomers: 0
  });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to fetch hero stats:', e);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats periodically
    const timer = setInterval(fetchStats, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 md:py-24 px-6 sm:px-8 max-w-7xl mx-auto rounded-[2.5rem] my-6 bg-brand-light/45 backdrop-blur-xl border border-brand-primary/15 shadow-sm">
      {/* Decorative ambient subtle indicators */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Main Pitch Details */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-brand-dark tracking-tight font-heading">
              Onesky<br/>
              <span className="text-brand-primary">Outdoor</span>
            </h1>
            <p className="text-base sm:text-lg text-brand-dark/70 leading-relaxed max-w-xl font-sans">
              Layanan persewaan perlengkapan pendakian gunung yang menyediakan berbagai peralatan berkualitas, mulai dari tenda, carrier, alat masak, hingga perlengkapan pendukung lainnya.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={onScrollToCatalog}
              className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Sewa Alat Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('single-items');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-brand-light/85 border border-brand-primary/20 hover:bg-brand-light hover:border-brand-primary/45 text-brand-dark font-bold rounded-2xl transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Lihat Eceran Satuan</span>
            </button>
          </div>


        </div>

        {/* METRICS GRID - Exact Apple style matching */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-brand-light/45 backdrop-blur-xl p-6 rounded-[2rem] shadow-md border border-brand-primary/15 flex flex-col justify-center items-center text-center transition-all duration-300 hover:scale-102 hover:shadow-lg hover:border-brand-primary/30">
            <span className="text-4xl font-black text-brand-dark tracking-tight font-heading">{stats.totalItems}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary mt-2 font-mono">Total Peralatan</span>
          </div>

          <div className="bg-brand-light/45 backdrop-blur-xl p-6 rounded-[2rem] shadow-md border border-brand-primary/15 flex flex-col justify-center items-center text-center transition-all duration-300 hover:scale-102 hover:shadow-lg hover:border-brand-primary/30">
            <span className="text-4xl font-black text-brand-dark tracking-tight font-heading">{stats.availableItems}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary mt-2 font-mono">Stok Tersedia</span>
          </div>

          <div className="bg-brand-light/45 backdrop-blur-xl p-6 rounded-[2rem] shadow-md border border-brand-primary/15 flex flex-col justify-center items-center text-center transition-all duration-300 hover:scale-102 hover:shadow-lg hover:border-brand-primary/30">
            <span className="text-4xl font-black text-brand-dark tracking-tight font-heading">{stats.rentedItems}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary mt-2 font-mono">Sedang Disewa</span>
          </div>

          <div className="bg-brand-dark/75 backdrop-blur-xl p-6 rounded-[2rem] shadow-lg border border-brand-primary/25 flex flex-col justify-center items-center text-center text-white transition-all duration-300 hover:scale-102 hover:shadow-xl hover:border-brand-primary/40">
            <span className="text-4xl font-black tracking-tight text-white font-heading">4</span>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-2 text-brand-light/80 font-mono">Paket Siap</span>
          </div>
        </div>
      </div>
    </section>
  );
}
