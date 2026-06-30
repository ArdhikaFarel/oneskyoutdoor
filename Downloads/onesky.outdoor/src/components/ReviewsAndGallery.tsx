/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, Camera, MessageSquare, Send, Check, Plus, Upload, Trash2 } from 'lucide-react';
import { Review } from '../types';

export default function ReviewsAndGallery() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Gallery State
  interface GalleryItem {
    id: string;
    url: string;
    caption: string;
    isCustom?: boolean;
  }

  const defaultGalleryImages: GalleryItem[] = [
    {
      id: "def-1",
      url: "/assets/images/DOKUMENTASI 1.webp",
      caption: "Campsite by the pristine lake"
    },
    {
      id: "def-2",
      url: "/assets/images/DOKUMENTASI 2.webp",
      caption: "-"
    },
    {
      id: "def-3",
      url: "/assets/images/DOKUMENTASI 3.webp",
      caption: "-"
    },
    {
      id: "def-4",
      url: "/assets/images/DOKUMENTASI 4.webp",
      caption: "-"
    },
    {
      id: "def-5",
      url: "/assets/images/DOKUMENTASI 5.webp",
      caption: "-"
    },
    {
      id: "def-6",
      url: "/assets/images/DOKUMENTASI 6.webp",
      caption: "-"
    }
  ];

  const [customPhotos, setCustomPhotos] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('onesky_gallery_photos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoError, setPhotoError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('Ukuran file maksimal 5MB');
        return;
      }
      setPhotoFile(file);
      setPhotoUrlInput('');
      setPhotoError('');
    }
  };

  const addPhotoToGallery = (url: string, caption: string) => {
    const newCustomPhoto: GalleryItem = {
      id: `custom-${Date.now()}`,
      url,
      caption,
      isCustom: true
    };
    const updatedList = [newCustomPhoto, ...customPhotos];
    setCustomPhotos(updatedList);
    try {
      localStorage.setItem('onesky_gallery_photos', JSON.stringify(updatedList));
    } catch (err) {
      console.error('Failed to save photo to localStorage', err);
    }
    resetPhotoForm();
    setIsAddingPhoto(false);
  };

  const handlePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoError('');

    if (!photoCaption.trim()) {
      setPhotoError('Silakan masukkan caption foto');
      return;
    }

    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        addPhotoToGallery(base64Url, photoCaption.trim());
      };
      reader.onerror = () => {
        setPhotoError('Gagal membaca file gambar');
      };
      reader.readAsDataURL(photoFile);
    } else if (photoUrlInput.trim()) {
      addPhotoToGallery(photoUrlInput.trim(), photoCaption.trim());
    } else {
      setPhotoError('Silakan pilih file gambar atau masukkan URL');
    }
  };

  const handleDeleteCustomPhoto = (id: string) => {
    const updatedList = customPhotos.filter(p => p.id !== id);
    setCustomPhotos(updatedList);
    try {
      localStorage.setItem('onesky_gallery_photos', JSON.stringify(updatedList));
    } catch (err) {
      console.error('Failed to update localStorage', err);
    }
  };

  const resetPhotoForm = () => {
    setPhotoFile(null);
    setPhotoUrlInput('');
    setPhotoCaption('');
    setPhotoError('');
  };

  const allGalleryImages = [...customPhotos, ...defaultGalleryImages];

  // Fetch reviews from our API
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Error loading reviews:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    setIsSubmitting(true);
    try {
      const mockAvatar = `/assets/images/photo-${1500000000000 + Math.floor(Math.random() * 9000000)}.jpg`;
      
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formName,
          rating: formRating,
          comment: formComment,
          avatar: mockAvatar
        })
      });

      if (res.ok) {
        setIsSubmitted(true);
        setFormName('');
        setFormComment('');
        setFormRating(5);
        fetchReviews(); // Refresh review list
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-16 px-4 max-w-7xl mx-auto space-y-20">
      
      {/* GALLERY SUBSECTION */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#fff8f5] tracking-tight font-heading">
            Galeri Petualangan OneSky
          </h2>
          <p className="text-[#fff8f5] mt-3 font-sans text-sm md:text-base leading-relaxed">
            Kumpulan potret seru dari para petualang yang menyewa perlengkapan kemping dan hiking premium di OneSky Outdoor.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => { setIsAddingPhoto(!isAddingPhoto); resetPhotoForm(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md cursor-pointer border border-white/10"
            >
              <Camera className="w-4 h-4" />
              <span>{isAddingPhoto ? 'Tutup Form Foto' : '+ Tambah Foto Petualangan'}</span>
            </button>
          </div>
        </div>

        {isAddingPhoto && (
          <div className="max-w-xl mx-auto mb-10 bg-brand-light/20 backdrop-blur-xl p-6 rounded-3xl border border-brand-primary/30 text-left shadow-xl animate-fade-in space-y-4">
            <h3 className="text-base md:text-lg font-bold text-white font-heading flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand-primary" />
              <span>Unggah Foto Baru ke Galeri</span>
            </h3>
            
            <form onSubmit={handlePhotoSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/90 block mb-1.5 font-heading">
                  Pilih Foto dari Perangkat atau Masukkan URL
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-dark/80 hover:bg-brand-dark border border-brand-primary/40 rounded-xl text-white text-xs font-semibold transition-all text-center">
                    <Upload className="w-4 h-4 text-brand-primary shrink-0" />
                    <span className="truncate">{photoFile ? photoFile.name : 'Pilih File Gambar'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-white/60 text-xs self-center hidden sm:inline">atau</span>
                  <input 
                    type="url"
                    placeholder="Tempel URL Gambar (https://...)"
                    value={photoUrlInput}
                    onChange={(e) => { setPhotoUrlInput(e.target.value); if(e.target.value) setPhotoFile(null); }}
                    className="flex-1 px-3.5 py-2.5 bg-brand-dark/80 rounded-xl border border-brand-primary/40 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/90 block mb-1.5 font-heading">
                  Keterangan Foto (Caption)
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Menikmati sunrise di Gunung Bromo dengan tenda OneSky"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-dark/80 rounded-xl border border-brand-primary/40 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {photoError && (
                <p className="text-red-300 text-xs bg-red-950/60 p-2.5 rounded-lg border border-red-500/30 font-medium">
                  {photoError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setIsAddingPhoto(false); resetPhotoForm(); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!photoCaption.trim() || (!photoFile && !photoUrlInput.trim())}
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-secondary disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambahkan ke Galeri</span>
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {allGalleryImages.map((img) => (
            <div 
              key={img.id} 
              className="group relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 border border-brand-primary/10"
            >
              <img 
                src={img.url} 
                alt={img.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              {img.isCustom && (
                <button
                  type="button"
                  onClick={() => handleDeleteCustomPhoto(img.id)}
                  className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer shadow-lg"
                  title="Hapus foto ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs font-semibold truncate w-full font-sans">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS SUBSECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        
        {/* Review List */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-secondary border border-brand-primary/20 rounded-full text-xs font-semibold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-brand-primary" />
              <span>Testimoni Penyewa</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#fff8f5] tracking-tight font-heading">Ulasan Pelanggan</h2>
            <p className="text-[#fff8f5] text-sm font-sans">
              Apa kata mereka yang telah merasakan kualitas alat dan layanan kami?
            </p>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-none px-4">
              {reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-brand-light/45 backdrop-blur-xl p-5 rounded-2xl border border-brand-primary/15 space-y-3 shadow-md hover:shadow-xl hover:border-brand-primary/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-bold text-brand-dark text-sm font-heading">{rev.username}</h4>
                        <p className="text-[10px] text-brand-dark/50 font-mono">{rev.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 bg-brand-primary/10 text-brand-secondary py-1 px-2.5 rounded-lg text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-brand-primary text-brand-primary shrink-0" />
                      <span>{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-brand-dark/80 text-sm leading-relaxed italic font-sans">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-12 text-brand-dark/50 text-sm font-medium">
                  Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Leave a Review Form */}
        <div className="lg:col-span-5 bg-brand-light/45 backdrop-blur-xl p-8 rounded-[2rem] border border-brand-primary/15 shadow-md hover:border-brand-primary/30 space-y-6 h-fit">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-brand-dark tracking-tight font-heading">Tulis Ulasan Anda</h3>
            <p className="text-sm text-brand-dark/60 font-sans">
              Bagikan pengalaman seru Anda menyewa alat kemping di OneSky Outdoor.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50/80 border border-green-200 text-green-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-green-900 font-heading">Ulasan Berhasil Terkirim!</h4>
              <p className="text-xs text-green-700 font-sans">
                Terima kasih atas masukan berharga Anda. Ulasan Anda telah diterbitkan secara instan di daftar testimoni kami.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-dark block font-heading">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Radhika Fael"
                  required
                  className="w-full px-4 py-2.5 bg-brand-light/70 rounded-xl border border-brand-primary/20 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-brand-light text-sm text-brand-dark"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-dark block font-heading">Rating Bintang</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 focus:outline-none hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star 
                        className={`w-7 h-7 transition-colors duration-200 ${
                          star <= formRating 
                            ? 'fill-brand-primary text-brand-primary' 
                            : 'text-brand-primary/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-brand-secondary ml-2 font-bold">
                    ({formRating}/5)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-dark block font-heading">Komentar / Pengalaman</label>
                <textarea 
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Ceritakan kepuasan Anda terhadap alat tenda, nesting, kompor, atau keramahan layanan kami..."
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 bg-brand-light/70 rounded-xl border border-brand-primary/20 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-brand-light text-sm text-brand-dark resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-brand-primary hover:bg-brand-secondary disabled:bg-neutral-300 text-white font-bold rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>Kirim Ulasan Sekarang</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

    </section>
  );
}
