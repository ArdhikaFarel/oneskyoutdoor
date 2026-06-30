/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingCart, LogIn, ShieldAlert, LogOut, LayoutDashboard, Compass } from 'lucide-react';
import { OrderItem } from '../types';

interface NavbarProps {
  cart: OrderItem[];
  onOpenCart: () => void;
  onOpenLogin: () => void;
  isAdmin: boolean;
  onLogout: () => void;
  currentView: 'customer' | 'admin';
  setView: (view: 'customer' | 'admin') => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  onOpenLogin,
  isAdmin,
  onLogout,
  currentView,
  setView
}: NavbarProps) {
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (id: string) => {
    // Switch to customer view if currently on admin view
    if (currentView === 'admin') {
      setView('customer');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 bg-brand-light/70 backdrop-blur-xl z-40 border-b border-brand-primary/10 py-4 px-4 sm:px-6 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <button 
          onClick={() => {
            setView('customer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group text-left"
        >
          <div className="w-10 h-10 bg-brand-dark text-white rounded-full group-hover:bg-brand-secondary transition-all duration-300 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
            <img 
              src="/assets/images/LOGO.jpg" 
              alt="Onesky Outdoor Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-brand-dark block font-heading">OneSky Outdoor</span>
          </div>
        </button>

        {/* CUSTOMER LINKS (Hidden in Admin Dashboard active view) */}
        {currentView === 'customer' && (
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-brand-dark/75 font-heading">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-brand-secondary transition-colors cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-primary after:transition-all"
            >
              Beranda
            </button>
            <button 
              onClick={() => scrollToSection('packages')}
              className="hover:text-brand-secondary transition-colors cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-primary after:transition-all"
            >
              Paket Hemat
            </button>
            <button 
              onClick={() => scrollToSection('single-items')}
              className="hover:text-brand-secondary transition-colors cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-primary after:transition-all"
            >
              Eceran Satuan
            </button>
            <button 
              onClick={() => scrollToSection('terms')}
              className="hover:text-brand-secondary transition-colors cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-primary after:transition-all"
            >
              Ketentuan Sewa
            </button>
            <button 
              onClick={() => scrollToSection('reviews')}
              className="hover:text-brand-secondary transition-colors cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-primary after:transition-all"
            >
              Ulasan
            </button>
            <button 
              onClick={() => scrollToSection('location')}
              className="hover:text-brand-secondary transition-colors cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-brand-primary after:transition-all"
            >
              Peta Lokasi
            </button>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          
          {/* Cart trigger (Customer only) */}
          {currentView === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-brand-light/80 border border-brand-primary/20 hover:border-brand-primary text-brand-dark hover:text-brand-secondary hover:bg-brand-light rounded-full transition-all duration-300 shadow-xs cursor-pointer"
              title="Buka Keranjang"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border border-brand-light font-mono animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {/* ADMIN PORTAL CONTROLLERS */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              {currentView === 'customer' ? (
                <button
                  onClick={() => setView('admin')}
                  className="px-5 py-2.5 bg-brand-dark hover:bg-brand-secondary text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer font-heading"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard Admin</span>
                </button>
              ) : (
                <button
                  onClick={() => setView('customer')}
                  className="px-5 py-2.5 bg-brand-light border border-brand-primary/20 hover:bg-brand-bg text-brand-dark font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer font-heading"
                >
                  <Compass className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Lihat Website</span>
                </button>
              )}
              
              <button
                onClick={onLogout}
                className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-all cursor-pointer"
                title="Admin Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-5 py-2 border-2 border-brand-primary text-brand-secondary hover:bg-brand-primary hover:text-white rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer font-heading"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          )}

        </div>

      </div>
    </nav>
  );
}
