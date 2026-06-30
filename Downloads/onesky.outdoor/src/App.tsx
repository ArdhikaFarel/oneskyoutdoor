/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PackageCatalog from './components/PackageCatalog';
import SingleItemCatalog from './components/SingleItemCatalog';
import TermsAndConditions from './components/TermsAndConditions';
import ReviewsAndGallery from './components/ReviewsAndGallery';
import GoogleMapsEmbed from './components/GoogleMapsEmbed';
import CartModal from './components/CartModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';
import { OrderItem } from './types';
import { Compass, Mail, Phone, MapPin, Sparkles, Check, ArrowUp } from 'lucide-react';

export default function App() {
  // Global View State
  const [currentView, setView] = useState<'customer' | 'admin'>('customer');
  
  // Cart State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Authentication State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState<{ email: string; token: string; name: string } | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Synchronization Trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check local storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('onesky_admin_token');
    const savedEmail = localStorage.getItem('onesky_admin_email');
    const savedName = localStorage.getItem('onesky_admin_name');

    if (savedToken && savedEmail) {
      setIsAdmin(true);
      setAdminData({
        email: savedEmail,
        token: savedToken,
        name: savedName || 'Administrator'
      });
    }
  }, []);

  const handleLoginSuccess = (data: { email: string; token: string; name: string }) => {
    setIsAdmin(true);
    setAdminData(data);
    localStorage.setItem('onesky_admin_token', data.token);
    localStorage.setItem('onesky_admin_email', data.email);
    localStorage.setItem('onesky_admin_name', data.name);
    setView('admin'); // Automatically switch to admin panel
    showToast(`Selamat datang kembali, ${data.name}!`);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminData(null);
    localStorage.removeItem('onesky_admin_token');
    localStorage.removeItem('onesky_admin_email');
    localStorage.removeItem('onesky_admin_name');
    setView('customer');
    showToast('Berhasil keluar dari sesi Administrator.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // --- CART MANAGEMENT SYSTEM ---
  const handleAddToCart = (item: any, isPackage: boolean) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id && i.isPackage === isPackage);
      
      if (existing) {
        // Enforce max stock limit checks
        if (existing.quantity >= item.availableStock) {
          showToast(`⚠️ Tidak bisa menambah qty. Stok sisa ${item.availableStock} pcs!`);
          return prevCart;
        }
        showToast(`✔ Qty ${item.name} berhasil ditambah!`);
        return prevCart.map((i) =>
          i.id === item.id && i.isPackage === isPackage
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        showToast(`✔ ${item.name} dimasukkan ke keranjang!`);
        return [
          ...prevCart,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            isPackage
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, isPackage: boolean, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id && item.isPackage === isPackage) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: Math.max(1, nextQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string, isPackage: boolean) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.isPackage === isPackage)));
    showToast('Alat dihapus dari keranjang.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('packages');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Force-reload frontend lists when admin modifies catalogs
  const handleAdminRefreshStats = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-transparent relative overflow-x-hidden">
      
      {/* TOAST BANNER */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-white/90 backdrop-blur-md text-neutral-900 px-5 py-3.5 rounded-2xl border border-white/50 shadow-lg flex items-center gap-3 animate-slide-in text-xs font-semibold max-w-sm">
          <div className="w-5 h-5 bg-neutral-900 text-white rounded-full flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* STICKY NAVIGATION BAR */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        currentView={currentView}
        setView={setView}
      />

      {/* CORE PAGES VIEWS SWITCHER */}
      <main className="flex-1">
        {currentView === 'customer' ? (
          /* CUSTOMER HOME LAYOUTS */
          <div className="space-y-6 animate-fade-in">
            {/* Page 1 - Home Hero section */}
            <Hero onScrollToCatalog={handleScrollToCatalog} />
            
            {/* Page 2 - Package Catalog */}
            <PackageCatalog 
              onAddToCart={handleAddToCart} 
              refreshTrigger={refreshTrigger} 
            />
            
            {/* Page 3 - Single Item Pricing */}
            <SingleItemCatalog 
              onAddToCart={handleAddToCart} 
              refreshTrigger={refreshTrigger} 
            />
            
            {/* Page 4 - Terms and Conditions */}
            <TermsAndConditions />
            
            {/* Page 5 - Reviews & Adventure Gallery */}
            <ReviewsAndGallery />
            
            {/* Page 6 - Location Map Area */}
            <GoogleMapsEmbed />
          </div>
        ) : (
          /* SECURE ADMIN PANEL DASHBOARD */
          <div className="animate-fade-in">
            <AdminDashboard 
              adminToken={adminData?.token || ''} 
              onRefreshStats={handleAdminRefreshStats}
            />
          </div>
        )}
      </main>

      {/* CUSTOMER MODALS TRIGGERS */}
      <AnimatePresence>
        {isCartOpen && (
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        )}
      </AnimatePresence>

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* HIGH-FIDELITY FOOTER */}
      <footer className="bg-brand-dark text-brand-light py-16 px-4 border-t border-brand-primary/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 text-white">
              <div className="text-left">
                <span className="text-lg font-bold tracking-tight text-white font-heading">OneSky Outdoor</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-brand-light/70 font-sans">
              Penyedia layanan persewaan perlengkapan camping, hiking, dan kebutuhan outdoor terpercaya di Malang, Jawa Timur. Bersih, higienis, dan terawat.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading">Tautan Cepat</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <button onClick={() => setView('customer')} className="hover:text-brand-secondary transition-colors cursor-pointer text-brand-light/70">
                  Halaman Utama
                </button>
              </li>
              <li>
                <button onClick={handleScrollToCatalog} className="hover:text-brand-secondary transition-colors cursor-pointer text-brand-light/70">
                  Katalog Paket Hemat
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setView('customer');
                    setTimeout(() => {
                      const el = document.getElementById('single-items');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }} 
                  className="hover:text-brand-secondary transition-colors cursor-pointer text-brand-light/70"
                >
                  Sewa Alat Satuan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setView('customer');
                    setTimeout(() => {
                      const el = document.getElementById('terms');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }} 
                  className="hover:text-brand-secondary transition-colors cursor-pointer text-brand-light/70"
                >
                  Ketentuan Persewaan
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading">Hubungi Kami</h4>
            <ul className="space-y-2 text-xs text-brand-light/70 font-sans">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-secondary" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-secondary" />
                <span>info@oneskyoutdoor.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0 mt-0.5" />
                <span>Jl. Raya Bululawang, Malang, Jawa Timur</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Operational Services */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading">Layanan Operasional</h4>
            <p className="text-xs text-brand-light/70 leading-relaxed font-sans">
              Basecamp buka setiap hari: 08:00 - 21:00 WIB.<br />
              Booking via website dapat dilakukan 24 jam nonstop. Konfirmasi otomatis akan diteruskan ke tim support WhatsApp kami.
            </p>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-brand-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-light/40 font-mono">
          <span>&copy; 2026 OneSky Outdoor. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Sitemap</span>
            <span className="hover:text-white transition-colors cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>
      </footer>

      {/* BACK TO TOP FLOATING BUTTON */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-full border border-brand-primary/10 shadow-lg transition-all z-30 cursor-pointer hidden sm:block hover:-translate-y-1"
        title="Kembali ke atas"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

    </div>
  );
}
