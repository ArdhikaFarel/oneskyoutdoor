/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Trash2, Plus, Minus, Send, Calendar, User, Phone, CheckCircle } from 'lucide-react';
import { OrderItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: OrderItem[];
  onUpdateQuantity: (id: string, isPackage: boolean, delta: number) => void;
  onRemoveItem: (id: string, isPackage: boolean) => void;
  onClearCart: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Set default dates to tomorrow and day after tomorrow
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfterTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [rentalDate, setRentalDate] = useState(getTomorrowString());
  const [returnDate, setReturnDate] = useState(getDayAfterTomorrowString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // Calculate rental duration in days
  const getDurationDays = () => {
    const start = new Date(rentalDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
  };

  const durationDays = getDurationDays();

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalPrice = subtotal * durationDays;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !rentalDate || !returnDate) {
      alert("Harap lengkapi seluruh formulir booking!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save order to backend DB
      const orderBody = {
        customerName,
        customerPhone,
        rentalDate,
        returnDate,
        items: cart,
        totalPrice
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody)
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan data pesanan di backend database.");
      }

      const savedOrder = await res.json();
      setSuccessOrder(savedOrder);

      // 2. Generate WhatsApp message
      // Formatting list of items
      const itemsListText = cart.map((item, idx) => {
        return `${idx + 1}. ${item.name} (${item.isPackage ? 'Paket' : 'Satuan'})\n   Qty: ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`;
      }).join('\n');

      const message = `Halo OneSky Outdoor! Saya ingin menyewa perlengkapan outdoor dengan rincian berikut:

ID Booking: ${savedOrder.id}
Nama: ${customerName}
No. HP: ${customerPhone}
Tanggal Sewa: ${rentalDate}
Tanggal Kembali: ${returnDate}
Durasi Sewa: ${durationDays} hari

*Daftar Peralatan:*
${itemsListText}

*Total Biaya:* ${formatPrice(totalPrice)} (per ${durationDays} hari)

Mohon dikonfirmasi ketersediaan alat dan mekanisme pengambilannya. Terima kasih!`;

      // 3. Open WhatsApp link (target number is a mock standard admin number)
      const waNumber = "6281234567890"; // WhatsApp admin number template
      const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(message)}`;
      
      // Open in a new tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Clear the local cart
      onClearCart();
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(`Terjadi kesalahan saat memproses checkout: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOrder(null);
    setCustomerName('');
    setCustomerPhone('');
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
      onClick={onClose}
      className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 flex justify-end cursor-pointer"
    >
      
      {/* Drawer Card Panel */}
      <motion.div 
        initial={{ x: '100%', opacity: 0, scale: 0.95 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: '100%', opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-brand-light/75 backdrop-blur-2xl w-full max-w-xl h-full shadow-2xl flex flex-col justify-between border-l border-brand-primary/15 cursor-default"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-brand-primary/15 flex items-center justify-between bg-transparent">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-brand-dark tracking-tight font-heading">Keranjang Booking</h3>
            <span className="bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-brand-dark/50 hover:text-brand-dark hover:bg-brand-primary/10 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        {successOrder ? (
          /* Success Screen */
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-brand-dark tracking-tight font-heading">Booking Berhasil Dikirim!</h4>
              <p className="text-xs text-brand-dark/70 max-w-sm mx-auto font-sans">
                ID Booking Anda adalah <strong className="font-mono text-brand-secondary bg-brand-primary/10 px-2 py-1 rounded">{successOrder.id}</strong>. Rincian pesanan telah dikirimkan ke WhatsApp admin kami.
              </p>
            </div>
            <div className="bg-brand-light/95 border border-brand-primary/15 p-5 rounded-2xl w-full text-left space-y-2.5 text-xs">
              <div className="flex justify-between font-sans">
                <span className="text-brand-dark/60">Penyewa</span>
                <span className="font-bold text-brand-dark">{successOrder.customerName}</span>
              </div>
              <div className="flex justify-between font-sans">
                <span className="text-brand-dark/60">Periode Sewa</span>
                <span className="font-bold text-brand-dark">{successOrder.rentalDate} s/d {successOrder.returnDate}</span>
              </div>
              <div className="flex justify-between font-sans">
                <span className="text-brand-dark/60">Durasi</span>
                <span className="font-bold text-brand-dark">{durationDays} hari</span>
              </div>
              <div className="border-t border-dashed border-brand-primary/15 pt-2.5 flex justify-between text-sm font-bold font-heading">
                <span className="text-brand-dark">Total Pembayaran</span>
                <span className="text-brand-secondary font-mono">{formatPrice(successOrder.totalPrice)}</span>
              </div>
            </div>
            <button
              onClick={handleSuccessClose}
              className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md font-heading"
            >
              Kembali Belanja
            </button>
          </div>
        ) : (
          /* Form & Cart items */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            
            {/* Cart Items List */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest font-mono">Daftar Belanja:</p>
              
              {cart.length === 0 ? (
                <div className="text-center py-12 text-brand-dark/50 bg-brand-light rounded-2xl border border-dashed border-brand-primary/20 text-sm font-medium font-sans">
                  Keranjang masih kosong. Silakan pilih alat camping terbaik Anda di katalog!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div 
                      key={`${item.id}-${item.isPackage}`} 
                      className="bg-brand-light/95 backdrop-blur-sm p-4 rounded-2xl border border-brand-primary/10 flex gap-4 items-center justify-between shadow-xs"
                    >
                      <div className="flex-1 space-y-0.5 text-left">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-brand-primary/10 text-brand-secondary font-mono">
                          {item.isPackage ? 'Paket' : 'Satuan'}
                        </span>
                        <h4 className="font-bold text-brand-dark text-sm mt-1 font-heading">{item.name}</h4>
                        <p className="text-xs text-brand-primary font-mono font-bold">
                          {formatPrice(item.price)} <span className="text-[10px] font-normal text-brand-dark/50">/hari</span>
                        </p>
                      </div>

                      {/* Quantity Selector and delete icon */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-brand-light border border-brand-primary/15 px-2.5 py-1 rounded-xl">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.isPackage, -1)}
                            className="p-1 hover:text-brand-dark rounded"
                          >
                            <Minus className="w-3.5 h-3.5 text-brand-dark/50 hover:text-brand-dark" />
                          </button>
                          <span className="text-xs font-bold font-mono text-brand-dark min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.isPackage, 1)}
                            className="p-1 hover:text-brand-dark rounded"
                          >
                            <Plus className="w-3.5 h-3.5 text-brand-dark/50 hover:text-brand-dark" />
                          </button>
                        </div>

                        <button 
                          onClick={() => onRemoveItem(item.id, item.isPackage)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              /* Checkout Form details */
              <form onSubmit={handleCheckout} className="space-y-4 bg-brand-light p-5 rounded-3xl border border-brand-primary/15 shadow-sm">
                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest font-mono text-left">Formulir Penyewa:</p>
                
                <div className="space-y-3">
                  {/* Name field */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-brand-dark block uppercase tracking-wider font-heading">Nama Lengkap</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-brand-primary absolute left-3 top-3" />
                      <input 
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Radhika Fael"
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-brand-light/70 rounded-xl border border-brand-primary/20 text-xs focus:bg-brand-light focus:outline-none focus:ring-1 focus:ring-brand-primary text-brand-dark font-sans"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-brand-dark block uppercase tracking-wider font-heading">No. WhatsApp Aktif</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-brand-primary absolute left-3 top-3" />
                      <input 
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-brand-light/70 rounded-xl border border-brand-primary/20 text-xs focus:bg-brand-light focus:outline-none focus:ring-1 focus:ring-brand-primary text-brand-dark font-sans"
                      />
                    </div>
                  </div>

                  {/* Rental & Return date fields */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-dark block uppercase tracking-wider font-heading">Tanggal Sewa (Mulai)</label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-brand-primary absolute left-3 top-3" />
                        <input 
                          type="date"
                          value={rentalDate}
                          onChange={(e) => setRentalDate(e.target.value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-9 pr-3 py-2 bg-brand-light/70 rounded-xl border border-brand-primary/20 text-xs focus:bg-brand-light focus:outline-none focus:ring-1 focus:ring-brand-primary text-brand-dark font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-dark block uppercase tracking-wider font-heading">Tanggal Kembali (Selesai)</label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-brand-primary absolute left-3 top-3" />
                        <input 
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          required
                          min={rentalDate || new Date().toISOString().split('T')[0]}
                          className="w-full pl-9 pr-3 py-2 bg-brand-light/70 rounded-xl border border-brand-primary/20 text-xs focus:bg-brand-light focus:outline-none focus:ring-1 focus:ring-brand-primary text-brand-dark font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Calculation Summary panel */}
                <div className="mt-4 pt-3 border-t border-brand-primary/10 space-y-2 text-xs">
                  <div className="flex justify-between font-sans">
                    <span className="text-brand-dark/50">Subtotal Sewa Harian</span>
                    <span className="font-bold text-brand-dark font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="text-brand-dark/50">Durasi Booking</span>
                    <span className="font-bold text-brand-dark">{durationDays} Hari</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-brand-dark/50 border-t border-dashed border-brand-primary/15 pt-2">
                    <span className="font-heading">Total Pembayaran</span>
                    <span className="font-mono text-base text-brand-secondary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-brand-primary hover:bg-brand-secondary text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer font-heading hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? 'Memproses...' : 'Booking via WhatsApp'}</span>
                </button>
              </form>
            )}

          </div>
        )}

      </motion.div>

    </motion.div>
  );
}
