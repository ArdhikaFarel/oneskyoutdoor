/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Package as PkgIcon, 
  Layers, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Activity, 
  Filter, 
  AlertCircle 
} from 'lucide-react';
import { Item, Package, Order, DashboardStats } from '../types';

interface AdminDashboardProps {
  adminToken: string;
  onRefreshStats: () => void;
}

export default function AdminDashboard({ adminToken, onRefreshStats }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'packages' | 'orders'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  
  // Active Edit IDs
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editPkgId, setEditPkgId] = useState<string | null>(null);

  // Form Fields - Item
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [itemStock, setItemStock] = useState(0);
  const [itemCategory, setItemCategory] = useState('Tent');
  const [itemImage, setItemImage] = useState('');

  // Form Fields - Package
  const [pkgName, setPkgName] = useState('');
  const [pkgContents, setPkgContents] = useState('');
  const [pkgPrice, setPkgPrice] = useState(0);
  const [pkgStock, setPkgStock] = useState(0);
  const [pkgImage, setPkgImage] = useState('');

  // Order status filter
  const [orderFilter, setOrderFilter] = useState<'All' | 'Pending' | 'Active' | 'Completed' | 'Cancelled'>('All');

  // Load everything
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, itemsRes, pkgsRes, ordersRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/items'),
        fetch('/api/packages'),
        fetch('/api/orders')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (itemsRes.ok) setItems(await itemsRes.json());
      if (pkgsRes.ok) setPackages(await pkgsRes.json());
      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        // Sort orders latest first
        oData.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(oData);
      }
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const handleRefresh = () => {
    loadDashboardData();
    onRefreshStats();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // --- SINGLE ITEM CRUD HANDLERS ---
  const handleOpenItemAdd = () => {
    setEditItemId(null);
    setItemName('');
    setItemPrice(10000);
    setItemStock(5);
    setItemCategory('Tent');
    setItemImage('/assets/images/photo-1504280390367-361c6d9f38f4.jpg');
    setIsItemModalOpen(true);
  };

  const handleOpenItemEdit = (item: Item) => {
    setEditItemId(item.id);
    setItemName(item.name);
    setItemPrice(item.price);
    setItemStock(item.stock);
    setItemCategory(item.category);
    setItemImage(item.image);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    
    const payload = {
      name: itemName,
      price: Number(itemPrice),
      stock: Number(itemStock),
      category: itemCategory,
      image: itemImage || '/assets/images/photo-1501555088652-021faa106b9b.jpg'
    };

    try {
      const url = editItemId ? `/api/items/${editItemId}` : '/api/items';
      const method = editItemId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsItemModalOpen(false);
        handleRefresh();
      } else {
        const err = await res.json();
        setActionError(err.error || 'Gagal menyimpan alat.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Kesalahan jaringan.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus alat ini?')) return;
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        handleRefresh();
      } else {
        alert('Gagal menghapus alat.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- PACKAGE CRUD HANDLERS ---
  const handleOpenPkgAdd = () => {
    setEditPkgId(null);
    setPkgName('');
    setPkgContents('1x Tenda Dome, 2x Matras, 2x Sleeping Bag');
    setPkgPrice(100000);
    setPkgStock(5);
    setPkgImage('/assets/images/photo-1515408320194-59643816c5b2.jpg');
    setIsPkgModalOpen(true);
  };

  const handleOpenPkgEdit = (pkg: Package) => {
    setEditPkgId(pkg.id);
    setPkgName(pkg.name);
    setPkgContents(pkg.contents.join(', '));
    setPkgPrice(pkg.price);
    setPkgStock(pkg.stock);
    setPkgImage(pkg.image);
    setIsPkgModalOpen(true);
  };

  const handleSavePkg = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    // Convert comma-separated string to list arrays
    const contentsArray = pkgContents.split(',').map(c => c.trim()).filter(c => c.length > 0);

    const payload = {
      name: pkgName,
      contents: contentsArray,
      price: Number(pkgPrice),
      stock: Number(pkgStock),
      image: pkgImage || '/assets/images/photo-1515408320194-59643816c5b2.jpg'
    };

    try {
      const url = editPkgId ? `/api/packages/${editPkgId}` : '/api/packages';
      const method = editPkgId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsPkgModalOpen(false);
        handleRefresh();
      } else {
        const err = await res.json();
        setActionError(err.error || 'Gagal menyimpan paket.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Kesalahan jaringan.');
    }
  };

  const handleDeletePkg = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket hemat ini?')) return;
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        handleRefresh();
      } else {
        alert('Gagal menghapus paket.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- ORDER STATUS HANDLERS (AUTOMATED STOCK) ---
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        handleRefresh();
      } else {
        alert('Gagal memperbarui status order.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orderFilter === 'All'
    ? orders
    : orders.filter(o => o.status === orderFilter);

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-brand-primary/10">
        <div className="text-left">
          <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight font-heading">
            Dashboard Admin
          </h2>
          <p className="text-xs text-brand-dark/60 mt-1 font-sans">
            Pantau statistik toko, kelola inventory alat sewa, paket hemat, serta verifikasi pesanan masuk.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-secondary transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-xs font-heading hover:-translate-y-0.5"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* VIEW SELECTOR TABS */}
      <div className="flex flex-wrap gap-2 border-b border-brand-primary/10">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3.5 px-4 font-semibold text-xs uppercase tracking-widest transition-all border-b-2 cursor-pointer font-heading ${
            activeTab === 'overview'
              ? 'text-brand-primary border-brand-primary font-bold'
              : 'text-brand-dark/40 border-transparent hover:text-brand-primary'
          }`}
        >
          Ringkasan (Overview)
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`pb-3.5 px-4 font-semibold text-xs uppercase tracking-widest transition-all border-b-2 cursor-pointer font-heading ${
            activeTab === 'items'
              ? 'text-brand-primary border-brand-primary font-bold'
              : 'text-brand-dark/40 border-transparent hover:text-brand-primary'
          }`}
        >
          Kelola Alat Satuan ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`pb-3.5 px-4 font-semibold text-xs uppercase tracking-widest transition-all border-b-2 cursor-pointer font-heading ${
            activeTab === 'packages'
              ? 'text-brand-primary border-brand-primary font-bold'
              : 'text-brand-dark/40 border-transparent hover:text-brand-primary'
          }`}
        >
          Kelola Paket ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3.5 px-4 font-semibold text-xs uppercase tracking-widest transition-all border-b-2 cursor-pointer font-heading ${
            activeTab === 'orders'
              ? 'text-brand-primary border-brand-primary font-bold'
              : 'text-brand-dark/40 border-transparent hover:text-brand-primary'
          }`}
        >
          Kelola Pesanan ({orders.length})
        </button>
      </div>

      {/* INNER CONTENT FOR TABS */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">

          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              
              {/* Big Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-brand-light/45 backdrop-blur-xl p-6 rounded-2xl border border-brand-primary/10 flex items-center gap-4 shadow-md hover:border-brand-primary/25 transition-all">
                  <div className="p-3 bg-brand-primary/10 border border-brand-primary/15 text-brand-secondary rounded-xl">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-brand-dark/50 text-[10px] uppercase font-mono tracking-wider">Total Tipe Alat</p>
                    <h4 className="text-2xl font-bold text-brand-dark font-mono">{stats.totalItems}</h4>
                  </div>
                </div>

                <div className="bg-brand-light/45 backdrop-blur-xl p-6 rounded-2xl border border-brand-primary/10 flex items-center gap-4 shadow-md hover:border-brand-primary/25 transition-all">
                  <div className="p-3 bg-green-50/50 border border-green-100/50 text-green-700 rounded-xl">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-brand-dark/50 text-[10px] uppercase font-mono tracking-wider">Tersedia di Rak</p>
                    <h4 className="text-2xl font-bold text-green-700 font-mono">{stats.availableItems}</h4>
                  </div>
                </div>

                <div className="bg-brand-light/45 backdrop-blur-xl p-6 rounded-2xl border border-brand-primary/10 flex items-center gap-4 shadow-md hover:border-brand-primary/25 transition-all">
                  <div className="p-3 bg-amber-50/50 border border-amber-100/50 text-brand-secondary rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-brand-dark/50 text-[10px] uppercase font-mono tracking-wider">Sedang Disewa</p>
                    <h4 className="text-2xl font-bold text-brand-secondary font-mono">{stats.rentedItems}</h4>
                  </div>
                </div>

                <div className="bg-brand-light/45 backdrop-blur-xl p-6 rounded-2xl border border-brand-primary/10 flex items-center gap-4 shadow-md hover:border-brand-primary/25 transition-all">
                  <div className="p-3 bg-brand-primary/10 border border-brand-primary/15 text-brand-secondary rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-brand-dark/50 text-[10px] uppercase font-mono tracking-wider">Total Transaksi</p>
                    <h4 className="text-2xl font-bold text-brand-secondary font-mono">{stats.totalTransactions}</h4>
                  </div>
                </div>

                <div className="bg-brand-light/45 backdrop-blur-xl p-6 rounded-2xl border border-brand-primary/10 flex items-center gap-4 shadow-md hover:border-brand-primary/25 transition-all">
                  <div className="p-3 bg-brand-primary/10 border border-brand-primary/15 text-brand-secondary rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-brand-dark/50 text-[10px] uppercase font-mono tracking-wider">Total Pelanggan</p>
                    <h4 className="text-2xl font-bold text-brand-secondary font-mono">{stats.totalCustomers}</h4>
                  </div>
                </div>
              </div>

              {/* Informative Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Out of Stock Warning */}
                <div className="bg-brand-light/45 backdrop-blur-xl p-6 rounded-[2rem] border border-brand-primary/10 space-y-4 shadow-md">
                  <h3 className="font-bold text-brand-dark flex items-center gap-2 text-sm uppercase tracking-wider font-heading text-left">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span>Peringatan Stok Rendah (≤ 3 Pcs)</span>
                  </h3>
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 text-left">
                    {items.filter(i => i.availableStock <= 3).map(i => (
                      <div key={i.id} className="flex justify-between items-center bg-amber-50/55 p-3.5 rounded-xl border border-amber-200/30 text-xs font-sans">
                        <span className="font-bold text-brand-dark">{i.name}</span>
                        <span className="font-mono bg-amber-100 text-brand-dark font-bold px-2 py-0.5 rounded text-[10px] border border-amber-200/40">
                          Sisa {i.availableStock} / {i.stock}
                        </span>
                      </div>
                    ))}
                    {items.filter(i => i.availableStock <= 3).length === 0 && (
                      <div className="text-center py-12 text-brand-dark/50 text-xs bg-brand-light/50 rounded-2xl border border-dashed border-brand-primary/20">
                        Semua stok alat kemping aman dan melimpah!
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Info & Tips */}
                <div className="bg-brand-dark/75 backdrop-blur-xl text-white p-8 rounded-[2rem] flex flex-col justify-between border border-brand-primary/20 shadow-lg">
                  <div className="space-y-4 text-left">
                    <h3 className="text-lg font-bold tracking-tight font-heading text-brand-light">Sistem Autopilot Stok</h3>
                    <p className="text-xs text-brand-light/70 leading-relaxed font-sans">
                      Sistem ini mengelola inventory kemping Anda secara otomatis. Saat pesanan masuk (Pending/Active), sistem langsung mengunci stok alat agar tidak terjadi over-booking. Saat order berstatus <strong>Returned (Selesai)</strong> atau <strong>Cancelled (Batal)</strong>, stok segera dikembalikan ke rak penyimpanan utama secara otomatis!
                    </p>
                  </div>
                  <div className="pt-6 border-t border-brand-primary/15 flex items-center justify-between text-[10px] font-mono text-brand-primary/60 mt-6">
                    <span>Admin Session Active</span>
                    <span>100% Automated Security</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: SINGLE ITEMS CRUD */}
          {activeTab === 'items' && (
            <div className="space-y-4 bg-brand-light/45 backdrop-blur-xl p-6 rounded-[2rem] border border-brand-primary/10 shadow-md">
              <div className="flex justify-between items-center pb-4 border-b border-brand-primary/10">
                <h3 className="font-bold text-brand-dark text-lg font-heading text-left">Inventory Perlengkapan Satuan</h3>
                <button
                  onClick={handleOpenItemAdd}
                  className="px-4 py-2 bg-brand-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-secondary transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs font-heading hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Tambah Alat Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="border-b border-brand-primary/10 text-brand-dark/50 font-bold uppercase tracking-wider text-[10px] font-heading">
                      <th className="py-3.5 px-2">Alat</th>
                      <th className="py-3.5 px-2">Kategori</th>
                      <th className="py-3.5 px-2 text-right">Biaya Sewa</th>
                      <th className="py-3.5 px-2 text-center">Tersedia / Total</th>
                      <th className="py-3.5 px-2 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/10">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-brand-primary/5 transition-all duration-200">
                        <td className="py-3.5 px-2 flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg border border-brand-primary/10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/images/photo-1501555088652-021faa106b9b.jpg';
                            }}
                          />
                          <span className="font-bold text-brand-dark">{item.name}</span>
                        </td>
                        <td className="py-3.5 px-2 font-medium text-brand-dark/60">{item.category}</td>
                        <td className="py-3.5 px-2 text-right font-mono font-bold text-brand-primary">
                          {formatPrice(item.price)}
                        </td>
                        <td className="py-3.5 px-2 text-center font-mono text-brand-dark/60">
                          <span className={`font-bold ${item.availableStock === 0 ? 'text-red-500' : 'text-brand-dark'}`}>
                            {item.availableStock}
                          </span>
                          <span className="text-brand-dark/40"> / {item.stock} Pcs</span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => handleOpenItemEdit(item)}
                              className="p-1.5 text-brand-primary hover:text-brand-secondary bg-brand-primary/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 rounded-lg transition-all"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGES CRUD */}
          {activeTab === 'packages' && (
            <div className="space-y-4 bg-brand-light/45 backdrop-blur-xl p-6 rounded-[2rem] border border-brand-primary/10 shadow-md">
              <div className="flex justify-between items-center pb-4 border-b border-brand-primary/10">
                <h3 className="font-bold text-brand-dark text-lg font-heading text-left">Daftar Paket Camping Hemat</h3>
                <button
                  onClick={handleOpenPkgAdd}
                  className="px-4 py-2 bg-brand-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-secondary transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs font-heading hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Tambah Paket Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="border-b border-brand-primary/10 text-brand-dark/50 font-bold uppercase tracking-wider text-[10px] font-heading">
                      <th className="py-3 px-2">Paket</th>
                      <th className="py-3 px-2">Isi Perlengkapan</th>
                      <th className="py-3 px-2 text-right">Harga Paket</th>
                      <th className="py-3 px-2 text-center">Tersedia / Total</th>
                      <th className="py-3 px-2 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/10">
                    {packages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-brand-primary/5 transition-all duration-200">
                        <td className="py-3.5 px-2 flex items-center gap-3 min-w-[150px]">
                          <img 
                            src={pkg.image} 
                            alt={pkg.name} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg border border-brand-primary/10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/images/photo-1515408320194-59643816c5b2.jpg';
                            }}
                          />
                          <span className="font-bold text-brand-dark">{pkg.name}</span>
                        </td>
                        <td className="py-3.5 px-2">
                          <p className="line-clamp-2 max-w-sm text-brand-dark/60 leading-relaxed font-normal">
                            {pkg.contents.join(', ')}
                          </p>
                        </td>
                        <td className="py-3.5 px-2 text-right font-mono font-bold text-brand-primary">
                          {formatPrice(pkg.price)}
                        </td>
                        <td className="py-3.5 px-2 text-center font-mono text-brand-dark/60">
                          <span className={`font-bold ${pkg.availableStock === 0 ? 'text-red-500' : 'text-brand-dark'}`}>
                            {pkg.availableStock}
                          </span>
                          <span className="text-brand-dark/40"> / {pkg.stock} Paket</span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => handleOpenPkgEdit(pkg)}
                              className="p-1.5 text-brand-primary hover:text-brand-secondary bg-brand-primary/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePkg(pkg.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 rounded-lg transition-all"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & BOOKINGS (ROBUST ACCESS) */}
          {activeTab === 'orders' && (
            <div className="space-y-4 bg-brand-light/45 backdrop-blur-xl p-6 rounded-[2rem] border border-brand-primary/10 shadow-md">
              
              {/* Filter Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-primary/10">
                <div className="space-y-0.5 text-left">
                  <h3 className="font-bold text-brand-dark text-lg font-heading">Daftar Reservasi & Penyewaan</h3>
                  <p className="text-[11px] text-brand-dark/60 font-sans">Verifikasi status transaksi kemping penyewa di bawah.</p>
                </div>
                
                {/* Status Filter */}
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'Pending', 'Active', 'Completed', 'Cancelled'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setOrderFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all font-heading ${
                        orderFilter === filter
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-brand-light text-brand-dark/70 border-brand-primary/15 hover:bg-brand-primary/10 hover:text-brand-dark'
                      }`}
                    >
                      {filter === 'All' ? 'Semua' : filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Lists Table */}
              <div className="overflow-x-auto scrollbar-none">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-brand-dark/50 font-sans font-medium">
                    Tidak ada pesanan masuk dengan kriteria filter ini.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="border-b border-brand-primary/10 text-brand-dark/50 font-bold uppercase tracking-wider text-[10px] font-heading">
                        <th className="py-3 px-2">ID Booking</th>
                        <th className="py-3 px-2">Pelanggan</th>
                        <th className="py-3 px-2">Tanggal Sewa (Mulai - Selesai)</th>
                        <th className="py-3 px-2">Item Disewa</th>
                        <th className="py-3 px-2 text-right">Total Biaya</th>
                        <th className="py-3 px-2 text-center">Status</th>
                        <th className="py-3 px-2 text-right">Aksi Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/10">
                      {filteredOrders.map((order) => {
                        return (
                          <tr key={order.id} className="hover:bg-brand-primary/5 transition-all duration-200">
                            <td className="py-3.5 px-2 font-mono font-bold text-brand-secondary">
                              {order.id}
                            </td>
                            <td className="py-3.5 px-2 space-y-0.5 text-left">
                              <p className="font-bold text-brand-dark">{order.customerName}</p>
                              <p className="text-brand-dark/50 font-mono text-[10px]">{order.customerPhone}</p>
                            </td>
                            <td className="py-3.5 px-2 font-mono text-brand-dark text-left">
                              <span className="block font-semibold">{order.rentalDate}</span>
                              <span className="block text-brand-dark/50 text-[10px]">s/d {order.returnDate}</span>
                            </td>
                            <td className="py-3.5 px-2 text-left">
                              <ul className="space-y-0.5">
                                {order.items.map((oi, i) => (
                                  <li key={i} className="text-[11px] text-brand-dark/80 font-medium">
                                    • {oi.name} <strong className="font-mono text-brand-primary">(x{oi.quantity})</strong>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="py-3.5 px-2 text-right font-mono font-bold text-brand-primary">
                              {formatPrice(order.totalPrice)}
                            </td>
                            <td className="py-3.5 px-2 text-center">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                order.status === 'Pending' ? 'bg-amber-50 text-amber-800 border border-amber-200/50' :
                                order.status === 'Active' ? 'bg-blue-50 text-blue-800 border border-blue-200/50' :
                                order.status === 'Completed' ? 'bg-green-50 text-green-800 border border-green-200/50' :
                                'bg-red-50 text-red-800 border border-red-200/50'
                              }`}>
                                {order.status === 'Pending' ? 'Pending' :
                                 order.status === 'Active' ? 'Active / Rented' :
                                 order.status === 'Completed' ? 'Returned' : 'Cancelled'}
                              </span>
                            </td>
                            <td className="py-3.5 px-2 text-right">
                              <div className="inline-flex gap-1">
                                {order.status === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, 'Active')}
                                      className="px-2.5 py-1 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-lg text-[10px] cursor-pointer shadow-xs font-heading"
                                    >
                                      Mark Rented
                                    </button>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                                      className="px-2.5 py-1 bg-brand-light hover:bg-brand-primary/10 border border-brand-primary/20 text-brand-dark/70 font-bold rounded-lg text-[10px] cursor-pointer font-heading"
                                    >
                                      Batal
                                    </button>
                                  </>
                                )}
                                {order.status === 'Active' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                                    className="px-2.5 py-1 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-lg text-[10px] cursor-pointer shadow-xs font-heading"
                                  >
                                    Mark Returned
                                  </button>
                                )}
                                {(order.status === 'Completed' || order.status === 'Cancelled') && (
                                  <span className="text-[10px] text-brand-dark/40 font-mono italic">No actions</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- MODAL DIALOGS --- */}

      {/* 1. SINGLE ITEM MODAL */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-light/95 backdrop-blur-xl w-full max-w-lg rounded-[2rem] border border-brand-primary/20 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button 
              onClick={() => setIsItemModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-dark/50 hover:text-brand-dark hover:bg-brand-primary/10 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6 text-left">
              <h3 className="text-xl font-extrabold text-brand-dark tracking-tight font-heading">
                {editItemId ? 'Edit Perlengkapan' : 'Tambah Perlengkapan Baru'}
              </h3>

              {actionError && (
                <div className="bg-red-50/80 text-red-800 p-3.5 rounded-xl flex items-center gap-2 text-xs border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Nama Alat</label>
                  <input 
                    type="text" 
                    value={itemName} 
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    placeholder="Contoh: Dome Tent (4 Person) waterproof"
                    className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs text-brand-dark transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Harga Sewa Harian (IDR)</label>
                    <input 
                      type="number" 
                      value={itemPrice} 
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      required
                      min={0}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono text-brand-dark transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Jumlah Stok</label>
                    <input 
                      type="number" 
                      value={itemStock} 
                      onChange={(e) => setItemStock(Number(e.target.value))}
                      required
                      min={1}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono text-brand-dark transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Kategori</label>
                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs text-brand-dark transition-all duration-200"
                    >
                      <option value="Tent">Tenda (Tent)</option>
                      <option value="Sleeping Bag">Sleeping Bag</option>
                      <option value="Cooking">Alat Masak (Cooking)</option>
                      <option value="Furniture">Furnitur & Kursi</option>
                      <option value="Lighting">Penerangan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Image URL (Unsplash)</label>
                    <input 
                      type="text" 
                      value={itemImage} 
                      onChange={(e) => setItemImage(e.target.value)}
                      placeholder="Masukkan link gambar"
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono text-brand-dark transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer mt-4 font-heading hover:-translate-y-0.5"
                >
                  Simpan Perubahan
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. PACKAGE MODAL */}
      {isPkgModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-light/95 backdrop-blur-xl w-full max-w-lg rounded-[2rem] border border-brand-primary/20 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button 
              onClick={() => setIsPkgModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-dark/50 hover:text-brand-dark hover:bg-brand-primary/10 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6 text-left">
              <h3 className="text-xl font-extrabold text-brand-dark tracking-tight font-heading">
                {editPkgId ? 'Edit Paket Hemat' : 'Tambah Paket Hemat Baru'}
              </h3>

              {actionError && (
                <div className="bg-red-50/80 text-red-800 p-3.5 rounded-xl flex items-center gap-2 text-xs border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <form onSubmit={handleSavePkg} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Nama Paket</label>
                  <input 
                    type="text" 
                    value={pkgName} 
                    onChange={(e) => setPkgName(e.target.value)}
                    required
                    placeholder="Contoh: PAKET A – HEALING RAME"
                    className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs text-brand-dark transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Isi Paket (Pisahkan dengan tanda Koma)</label>
                  <textarea 
                    value={pkgContents} 
                    onChange={(e) => setPkgContents(e.target.value)}
                    required
                    placeholder="Contoh: 1x Tenda Dome, 2x Sleeping Bags, 2x Matras"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs text-brand-dark resize-none transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Harga Paket Harian (IDR)</label>
                    <input 
                      type="number" 
                      value={pkgPrice} 
                      onChange={(e) => setPkgPrice(Number(e.target.value))}
                      required
                      min={0}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono text-brand-dark transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Stok Limit Paket</label>
                    <input 
                      type="number" 
                      value={pkgStock} 
                      onChange={(e) => setPkgStock(Number(e.target.value))}
                      required
                      min={1}
                      className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono text-brand-dark transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider font-heading">Image URL (Unsplash)</label>
                  <input 
                    type="text" 
                    value={pkgImage} 
                    onChange={(e) => setPkgImage(e.target.value)}
                    placeholder="Link gambar Unsplash"
                    className="w-full px-4 py-3 bg-white/80 rounded-xl border border-brand-primary/15 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono text-brand-dark transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer mt-4 font-heading hover:-translate-y-0.5"
                >
                  Simpan Perubahan
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
