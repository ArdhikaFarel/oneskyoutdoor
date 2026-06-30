/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminData: { email: string; token: string; name: string }) => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        onLoginSuccess({
          email: data.user.email,
          token: data.token,
          name: data.user.name
        });
        setEmail('');
        setPassword('');
        onClose();
      } else {
        setError(data.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan koneksi server. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-brand-light/45 backdrop-blur-xl w-full max-w-md rounded-3xl border border-brand-primary/15 overflow-hidden shadow-2xl relative animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brand-dark/50 hover:text-brand-dark hover:bg-brand-primary/10 rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 bg-brand-primary/10 border border-brand-primary/15 text-brand-primary rounded-2xl mx-auto">
              <Lock className="w-6 h-6 text-brand-primary" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark tracking-tight font-heading">Admin Login</h3>
          </div>

          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-800 p-3.5 rounded-xl flex gap-2 text-xs items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-brand-dark block uppercase tracking-wider font-heading">Email Admin</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-primary absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-brand-light/70 rounded-xl border border-brand-primary/20 focus:bg-brand-light focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs text-brand-dark font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-brand-dark block uppercase tracking-wider font-heading">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-primary absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-brand-light/70 rounded-xl border border-brand-primary/20 focus:bg-brand-light focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs text-brand-dark font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-secondary disabled:bg-neutral-300 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer font-heading hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <span>Masuk Sekarang</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
