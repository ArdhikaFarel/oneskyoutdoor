/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, AlertTriangle, Layers } from 'lucide-react';
import { Package } from '../types';

interface PackageCatalogProps {
  onAddToCart: (item: any, isPackage: boolean) => void;
  refreshTrigger: number;
}

export default function PackageCatalog({ onAddToCart, refreshTrigger }: PackageCatalogProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (e) {
      console.error('Error fetching packages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [refreshTrigger]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section id="packages" className="py-16 px-4 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#fff8f5] tracking-tight font-heading">
          Pilihan Paket Camping Hemat
        </h2>
        <p className="text-[#fff8f5] mt-3 font-sans text-sm md:text-base leading-relaxed">
          Sewa lebih hemat dengan paket lengkap kami. Sudah dirancang sesuai kebutuhan kapasitas personal, rombongan maupun keluarga.
        </p>
      </div>

      {/* Responsive Horizontal Scrollable Container */}
      <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0 justify-start md:justify-center px-4 md:px-0">
        {packages.map((pkg) => {
          const isOutOfStock = pkg.availableStock <= 0;
          return (
            <div 
              key={pkg.id} 
              className="bg-brand-light/45 backdrop-blur-xl rounded-3xl overflow-hidden border border-brand-primary/15 shadow-md hover:shadow-2xl hover:border-brand-primary/30 transition-all duration-350 flex flex-col justify-between group hover:-translate-y-2 shrink-0 w-[290px] sm:w-[320px] md:w-auto snap-start"
            >
              <div>
                {/* Package Image banner */}
                <div className="h-44 w-full relative overflow-hidden bg-brand-bg/55">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/photo-1515408320194-59643816c5b2.jpg';
                    }}
                  />
                  {/* Stock tag */}
                  <div className="absolute top-4 right-4">
                    {isOutOfStock ? (
                      <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wide flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Habis</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-brand-light/95 backdrop-blur-sm text-brand-dark text-[10px] font-bold rounded-lg uppercase tracking-wide shadow-xs border border-brand-primary/20">
                        Sisa {pkg.availableStock} Paket
                      </span>
                    )}
                  </div>
                </div>

                {/* Card details */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-brand-dark leading-tight group-hover:text-brand-secondary transition-colors font-heading">
                    {pkg.name}
                  </h3>
                  
                  {/* Contents checkmark list */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest font-mono">Isi Paket:</p>
                    <ul className="space-y-1.5">
                      {pkg.contents.map((item, index) => (
                        <li key={index} className="text-xs text-brand-dark/80 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                          <span className="leading-tight font-sans">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Price & Cart button */}
              <div className="p-6 pt-0 border-t border-brand-primary/10 mt-4">
                <div className="flex items-baseline justify-between py-4">
                  <p className="text-xs text-brand-dark/60 font-medium">Biaya Sewa</p>
                  <p className="text-lg font-extrabold text-brand-secondary font-mono">
                    {formatPrice(pkg.price)}<span className="text-[10px] font-normal text-brand-dark/60">/hari</span>
                  </p>
                </div>

                <button
                  onClick={() => onAddToCart(pkg, true)}
                  disabled={isOutOfStock}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isOutOfStock 
                      ? 'bg-neutral-200/50 text-neutral-400 cursor-not-allowed' 
                      : 'bg-brand-primary hover:bg-brand-secondary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Stok Habis' : 'Sewa Paket'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
