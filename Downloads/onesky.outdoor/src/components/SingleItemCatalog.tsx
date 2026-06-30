/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Flame, HelpCircle, Eye, Star, Info } from 'lucide-react';
import { Item } from '../types';

interface SingleItemCatalogProps {
  onAddToCart: (item: any, isPackage: boolean) => void;
  refreshTrigger: number;
}

export default function SingleItemCatalog({ onAddToCart, refreshTrigger }: SingleItemCatalogProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error('Error fetching items:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [refreshTrigger]);

  const categories = ['All', 'Tent', 'Sleeping Bag', 'Cooking', 'Furniture', 'Lighting'];

  const categoryTranslations: Record<string, string> = {
    'All': 'Semua Gear',
    'Tent': 'Tenda',
    'Sleeping Bag': 'Sleeping Bag',
    'Cooking': 'Alat Masak',
    'Furniture': 'Furnitur & Meja',
    'Lighting': 'Lampu / Senter'
  };

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(i => i.category === selectedCategory);

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
        <div className="w-8 h-8 border-4 border-neutral-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section id="single-items" className="py-16 px-4 max-w-7xl mx-auto scroll-mt-20 overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-10 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#fff8f5] tracking-tight font-heading">
          Daftar Harga Sewa Satuan
        </h2>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-widest border cursor-pointer font-heading ${
              selectedCategory === cat
                ? 'bg-brand-primary text-white border-brand-primary shadow-md scale-[1.02]'
                : 'bg-brand-light/80 backdrop-blur-sm text-brand-dark/70 border-brand-primary/15 hover:bg-brand-light hover:border-brand-primary/30'
            }`}
          >
            {categoryTranslations[cat] || cat}
          </button>
        ))}
      </div>

      {/* List/Table of Items with no images */}
      <div className="bg-brand-light/45 backdrop-blur-xl rounded-3xl border border-brand-primary/15 shadow-md overflow-hidden max-w-5xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-primary/10 bg-brand-light/60">
                <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-brand-dark/70 font-heading">
                  Nama Alat (Gear)
                </th>
                <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-brand-dark/70 font-heading hidden sm:table-cell">
                  Kategori
                </th>
                <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-brand-dark/70 font-heading hidden md:table-cell">
                  Status Stok
                </th>
                <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-brand-dark/70 font-heading text-right">
                  Harga / Hari
                </th>
                <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-brand-dark/70 font-heading text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/10">
              {filteredItems.map((item) => {
                const isOutOfStock = item.availableStock <= 0;
                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-brand-light/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-brand-dark text-sm sm:text-base font-heading">
                        {item.name}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1.5 sm:hidden">
                        <span className="bg-brand-dark/10 text-brand-dark text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {categoryTranslations[item.category] || item.category}
                        </span>
                        {isOutOfStock ? (
                          <span className="bg-red-50 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Habis
                          </span>
                        ) : (
                          <span className="bg-brand-primary/10 text-brand-secondary text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Stok: {item.availableStock}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <span className="bg-brand-dark/90 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {categoryTranslations[item.category] || item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      {isOutOfStock ? (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-red-200">
                          Habis
                        </span>
                      ) : (
                        <span className="bg-brand-light/95 text-brand-dark text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-brand-primary/20">
                          Stok: {item.availableStock}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-extrabold text-brand-secondary font-mono text-sm sm:text-base">
                        {formatPrice(item.price)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => onAddToCart(item, false)}
                        disabled={isOutOfStock}
                        className={`py-1.5 px-3 sm:px-4 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 mx-auto cursor-pointer ${
                          isOutOfStock 
                            ? 'bg-neutral-200/50 text-neutral-400 cursor-not-allowed' 
                            : 'bg-brand-primary hover:bg-brand-secondary text-white shadow-xs hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isOutOfStock ? 'Habis' : 'Sewa'}</span>
                        <span className="sm:hidden">{isOutOfStock ? 'Habis' : '+'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-brand-dark/50 font-medium">
                    Tidak ada item untuk kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
