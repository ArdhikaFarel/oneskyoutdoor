import React from 'react';
import { Clock, ShieldAlert, FileDigit, Truck, CheckCircle, HelpCircle } from 'lucide-react';

export default function TermsAndConditions() {
  const terms = [
    {
      icon: <Clock className="w-6 h-6 text-brand-primary" />,
      title: "DURASI SEWA & BIAYA OVERTIME",
      description: "HARGA YANG TERCANTUM BERLAKU UNTUK 24 JAM, APABILA OVERTIME DIKENAKAN CHARGE 5K/JAM"
    },
    {
      icon: <FileDigit className="w-6 h-6 text-brand-primary" />,
      title: "JAMINAN IDENTITAS PENYEWA",
      description: "SELAMA MENYEWA WAJIB MENINGGALKAN IDENTITAS DIRI YANG MASIH AKTIF, SEPERTI KTP, SIM, KARTU MAHASISWA, ATAU LAINNYA"
    },
    {
      icon: <Truck className="w-6 h-6 text-brand-primary" />,
      title: "SISTEM PENGAMBILAN & PENGIRIMAN",
      description: "PENGAMBILAN DAPAT DILAKUKAN LANGSUNG DIRUMAH / COD DI DAERAH BULULAWANG, DILUAR BULULAWANG DIKENAKAN ONGKIR"
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-brand-primary" />,
      title: "TANGGUNG JAWAB KERUSAKAN / HILANG",
      description: "Penyewa bertanggung jawab penuh atas kebersihan dan kondisi fisik alat. Kerusakan, hilangnya komponen, atau alat kotor parah akan dikenakan denda sesuai biaya perbaikan/pembersihan."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-brand-primary" />,
      title: "PROSES BOOKING",
      description: "SELURUH PROSES BOOKING DILAKUKAN MELALUI WEBSITE. PENYEWA WAJIB MEMILIH PERLENGKAPAN SESUAI KEBUTUHAN DAN MENGIRIMKAN PESANAN MELALUI KERANJANG. SETELAH ITU, SISTEM AKAN MENGARAHKAN PENYEWA KE WHATSAPP UNTUK KONFIRMASI DAN PROSES PEMBAYARAN"
    }
  ];

  return (
    <section id="terms" className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#fff8f5] tracking-tight font-heading">
          Syarat & Ketentuan Sewa
        </h2>
        <p className="text-[#fff8f5] mt-3 font-sans text-sm md:text-base leading-relaxed">
          Mohon luangkan waktu sejenak untuk membaca aturan persewaan kami demi kenyamanan dan kelancaran petualangan outdoor Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {terms.map((term, index) => (
          <div 
            key={index} 
            className="bg-brand-light/45 backdrop-blur-xl rounded-3xl p-6 border border-brand-primary/15 shadow-md hover:shadow-2xl hover:border-brand-primary/30 transition-all flex gap-4 hover:-translate-y-1.5 duration-350"
          >
            <div className="p-3 bg-brand-primary/10 border border-brand-primary/15 rounded-xl h-fit self-start shrink-0">
              {term.icon}
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-brand-dark text-lg leading-snug font-heading">
                {term.title}
              </h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed font-sans">
                {term.description}
              </p>
            </div>
          </div>
        ))}
        
        {/* Highlight Banner Card */}
        <div className="bg-brand-dark/75 backdrop-blur-xl text-white rounded-3xl p-6 flex flex-col justify-between border border-brand-primary/20 shadow-lg md:col-span-2 lg:col-span-1 hover:-translate-y-1.5 hover:border-brand-primary/35 transition-all duration-350">
          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-tight font-heading text-brand-light">Butuh Bantuan Lain?</h3>
            <p className="text-brand-light/80 text-sm leading-relaxed font-sans">
              Jika Anda memiliki kebutuhan khusus seperti penyewaan alat dalam jumlah sangat besar, sewa jangka panjang, atau rute COD di luar Bululawang, silakan hubungi tim kami via WhatsApp.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-brand-light/10 flex items-center justify-between text-xs font-mono text-brand-light/50">
            <span>Customer Support</span>
            <span>24/7 Available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
