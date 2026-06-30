import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function GoogleMapsEmbed() {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.721473130707!2d112.6789423!3d-8.1818274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e789b7eb9a0ff3b%3A0x4027a7b49375dc0!2sBululawang%2C%20Malang%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid";
  const directMapUrl = "https://maps.app.goo.gl/hGwRQ8CdjWSGzucA7";

  return (
    <section id="location" className="py-12 px-6 sm:px-10 bg-brand-light/45 backdrop-blur-xl rounded-[2.5rem] max-w-7xl mx-auto my-12 border border-brand-primary/15 shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Text Details */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-primary/10 text-brand-secondary border border-brand-primary/20 rounded-full text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-brand-primary" />
            <span>Lokasi Onezky Outdoor</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark leading-tight font-heading">
            Kunjungi Toko / Pickup Area Kami
          </h2>
          <p className="text-brand-dark/70 leading-relaxed text-sm font-sans">
            Kami melayani pengambilan alat langsung di tempat (Store Pickup) serta layanan Cash on Delivery (COD) khusus untuk area **Bululawang** dan sekitarnya. Pastikan Anda telah melakukan booking online sebelum melakukan pickup.
          </p>
          <div className="space-y-3 bg-brand-light/45 backdrop-blur-xl p-5 rounded-2xl border border-brand-primary/15 shadow-md">
            <div className="flex gap-3">
              <div className="p-2 bg-brand-primary/10 border border-brand-primary/15 rounded-lg text-brand-primary self-start shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-brand-dark text-sm font-heading">Alamat Pickup</h4>
                <p className="text-xs text-brand-dark/65 mt-0.5 font-sans">
                  Jl. Raya Bululawang, Bululawang, Malang, Jawa Timur 65171
                </p>
              </div>
            </div>
            <div className="border-t border-brand-primary/10 pt-3 flex gap-3">
              <div className="p-2 bg-brand-primary/10 border border-brand-primary/15 rounded-lg text-brand-primary self-start shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-brand-dark text-sm font-heading">Layanan COD</h4>
                <p className="text-xs text-brand-dark/65 mt-0.5 font-sans">
                  Area Bululawang (Alun-Alun Bululawang / SPBU / Minimarket terdekat)
                </p>
              </div>
            </div>
          </div>
          
          <a
            href={directMapUrl}
            target="_blank"
            referrerPolicy="no-referrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full sm:w-auto font-heading"
          >
            <Navigation className="w-4 h-4 text-white" />
            <span>Buka di Google Maps</span>
          </a>
        </div>

        {/* Map Canvas */}
        <div className="lg:col-span-7 h-[350px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-xs border border-brand-primary/15">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          />
        </div>
      </div>
    </section>
  );
}
