/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { Item, Package, Order, Review, DashboardStats } from './types';

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'db.json');

interface DbSchema {
  items: Item[];
  packages: Package[];
  orders: Order[];
  reviews: Review[];
}

const SEED_ITEMS: Item[] = [
  {
    id: 'item-1',
    name: 'Tenda Kapasitas 4/5',
    price: 25000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1504280390367-361c6d9f38f4.jpg',
    category: 'Tent'
  },
  {
    id: 'item-2',
    name: 'Tenda Kapasitas 2/3',
    price: 20000,
    stock: 20,
    availableStock: 20,
    image: '/assets/images/photo-1510312305653-8ed496efae75.jpg',
    category: 'Tent'
  },
  {
    id: 'item-3',
    name: 'Carrier 60 + 10 L',
    price: 10000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1553062407-98eeb64c6a62.jpg',
    category: 'Furniture'
  },
  {
    id: 'item-4',
    name: 'Carrier 50 + 10 L',
    price: 10000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1622560480605-d83c853bc5c3.jpg',
    category: 'Furniture'
  },
  {
    id: 'item-5',
    name: 'Day Pack',
    price: 10000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1509762774605-f07235a08f1f.jpg',
    category: 'Furniture'
  },
  {
    id: 'item-6',
    name: 'Nesting TNI',
    price: 5000,
    stock: 20,
    availableStock: 20,
    image: '/assets/images/photo-1585320806297-9794b3e4eeae.jpg',
    category: 'Cooking'
  },
  {
    id: 'item-7',
    name: 'Cooking Set',
    price: 5000,
    stock: 20,
    availableStock: 20,
    image: '/assets/images/photo-1533240332313-0db49b439ad3.jpg',
    category: 'Cooking'
  },
  {
    id: 'item-8',
    name: 'Panci Gril',
    price: 10000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1543087903-1ac2ec7aa8c5.jpg',
    category: 'Cooking'
  },
  {
    id: 'item-9',
    name: 'Alat Gril + Gas',
    price: 30000,
    stock: 10,
    availableStock: 10,
    image: '/assets/images/photo-1555507036-ab1f4038808a.jpg',
    category: 'Cooking'
  },
  {
    id: 'item-10',
    name: 'Isi Ulang Gas',
    price: 5000,
    stock: 50,
    availableStock: 50,
    image: '/assets/images/photo-1628155930542-3c7a64e2c833.jpg',
    category: 'Cooking'
  },
  {
    id: 'item-11',
    name: 'Gas + Isi',
    price: 7000,
    stock: 40,
    availableStock: 40,
    image: '/assets/images/photo-1628155930542-3c7a64e2c833.jpg',
    category: 'Cooking'
  },
  {
    id: 'item-12',
    name: 'Sleeping Bag Bulu',
    price: 7000,
    stock: 25,
    availableStock: 25,
    image: '/assets/images/photo-1501555088652-021faa106b9b.jpg',
    category: 'Sleeping Bag'
  },
  {
    id: 'item-13',
    name: 'Kompor Kotak Besar',
    price: 15000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1533240332313-0db49b439ad3.jpg',
    category: 'Cooking'
  },
  {
    id: 'item-14',
    name: 'Kompor Lipat',
    price: 5000,
    stock: 20,
    availableStock: 20,
    image: '/assets/images/photo-1533240332313-0db49b439ad3.jpg',
    category: 'Cooking'
  },
  {
    id: 'item-15',
    name: 'Hammock',
    price: 5000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1501555088652-021faa106b9b.jpg',
    category: 'Tent'
  },
  {
    id: 'item-16',
    name: 'Flysheet',
    price: 7000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1501555088652-021faa106b9b.jpg',
    category: 'Tent'
  },
  {
    id: 'item-17',
    name: 'PowerBank',
    price: 10000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1609592424109-dd77366b567d.jpg',
    category: 'Lighting'
  },
  {
    id: 'item-18',
    name: 'Lampu Tenda',
    price: 5000,
    stock: 25,
    availableStock: 25,
    image: '/assets/images/photo-1517411032315-54ef2cb783bb.jpg',
    category: 'Lighting'
  },
  {
    id: 'item-19',
    name: 'Tracking Pole',
    price: 10000,
    stock: 20,
    availableStock: 20,
    image: '/assets/images/photo-1551632811-561732d1e306.jpg',
    category: 'Furniture'
  },
  {
    id: 'item-20',
    name: 'Matras',
    price: 3000,
    stock: 40,
    availableStock: 40,
    image: '/assets/images/photo-1508873696983-2df519f0397e.jpg',
    category: 'Furniture'
  },
  {
    id: 'item-21',
    name: 'Headlamp',
    price: 5000,
    stock: 25,
    availableStock: 25,
    image: '/assets/images/photo-1520110120835-c96a9ef95676.jpg',
    category: 'Lighting'
  },
  {
    id: 'item-22',
    name: 'Sarung Tangan',
    price: 5000,
    stock: 20,
    availableStock: 20,
    image: '/assets/images/photo-1542272604-787c3835535d.jpg',
    category: 'Sleeping Bag'
  },
  {
    id: 'item-23',
    name: 'Meja Lipat',
    price: 10000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1601569842426-382a52efc6ff.jpg',
    category: 'Furniture'
  },
  {
    id: 'item-24',
    name: 'Kursi Lipat',
    price: 10000,
    stock: 25,
    availableStock: 25,
    image: '/assets/images/photo-1617135677591-189fa437f51a.jpg',
    category: 'Furniture'
  },
  {
    id: 'item-25',
    name: 'Tripod + Remote',
    price: 10000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1516035069371-29a1b244cc32.jpg',
    category: 'Lighting'
  },
  {
    id: 'item-26',
    name: 'Beli Gas + Isi',
    price: 13000,
    stock: 30,
    availableStock: 30,
    image: '/assets/images/photo-1628155930542-3c7a64e2c833.jpg',
    category: 'Cooking'
  },
  {
    id: 'item-27',
    name: 'Jacket Polar',
    price: 15000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1548883354-7622d03aca27.jpg',
    category: 'Sleeping Bag'
  },
  {
    id: 'item-28',
    name: 'Jacket Gorpcore',
    price: 15000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1539571696357-5a69c17a67c6.jpg',
    category: 'Sleeping Bag'
  },
  {
    id: 'item-29',
    name: 'Sepatu',
    price: 20000,
    stock: 15,
    availableStock: 15,
    image: '/assets/images/photo-1542291026-7eec264c27ff.jpg',
    category: 'Sleeping Bag'
  },
  {
    id: 'item-30',
    name: 'Topi',
    price: 5000,
    stock: 20,
    availableStock: 20,
    image: '/assets/images/photo-1534215754734-18e55d13e348.jpg',
    category: 'Sleeping Bag'
  },
  {
    id: 'item-31',
    name: 'Senter',
    price: 5000,
    stock: 25,
    availableStock: 25,
    image: '/assets/images/photo-1517411032315-54ef2cb783bb.jpg',
    category: 'Lighting'
  }
];

const SEED_PACKAGES: Package[] = [
  {
    id: 'pkg-1',
    name: 'PAKET A',
    contents: [
      '1 Kursi Lipat',
      '1 Meja Lipat'
    ],
    price: 15000,
    stock: 10,
    availableStock: 10,
    image: '/assets/images/PAKET A.jpg'
  },
  {
    id: 'pkg-2',
    name: 'PAKET B',
    contents: [
      '1 Kursi Lipat',
      '1 Meja Lipat',
      '1 Tripod'
    ],
    price: 25000,
    stock: 10,
    availableStock: 10,
    image: '/assets/images/PAKET B.jpg'
  },
  {
    id: 'pkg-3',
    name: 'PAKET C',
    contents: [
      '2 Kursi Lipat',
      '1 Meja Lipat'
    ],
    price: 25000,
    stock: 10,
    availableStock: 10,
    image: '/assets/images/PAKET C.jpg'
  },
  {
    id: 'pkg-4',
    name: 'PAKET D',
    contents: [
      '2 Kursi Lipat',
      '1 Meja Lipat',
      '1 Tripod'
    ],
    price: 35000,
    stock: 10,
    availableStock: 10,
    image: '/assets/images/PAKET D.jpg'
  },
  {
    id: 'pkg-5',
    name: 'PAKET E',
    contents: [
      '3 Kursi Lipat',
      '1 Meja Lipat'
    ],
    price: 35000,
    stock: 10,
    availableStock: 10,
    image: '/assets/images/PAKET E.jpg'
  },
  {
    id: 'pkg-6',
    name: 'PAKET F',
    contents: [
      '3 Kursi Lipat',
      '1 Meja Lipat',
      '1 Tripod'
    ],
    price: 45000,
    stock: 10,
    availableStock: 10,
    image: '/assets/images/PAKET F.jpg'
  },
  {
    id: 'pkg-7',
    name: 'PAKET G',
    contents: [
      '4 Kursi Lipat',
      '1 Meja Lipat'
    ],
    price: 45000,
    stock: 10,
    availableStock: 10,
    image: '/assets/images/PAKET G.jpg'
  },
  {
    id: 'pkg-8',
    name: 'PAKET H',
    contents: [
      '4 Kursi Lipat',
      '1 Meja Lipat',
      '1 Tripod'
    ],
    price: 55000,
    stock: 10,
    availableStock: 10,
    image: '/assets/images/PAKET H.jpg'
  },
  {
    id: 'pkg-9',
    name: 'PAKET HEALING SENDIRI',
    contents: [
      '1 Tenda (kapasitas 2/3 atau 4/5)',
      '1 Kursi Lipat XXL',
      '1 Tripod + Remote',
      '1 Meja Lipat'
    ],
    price: 45000,
    stock: 8,
    availableStock: 8,
    image: '/assets/images/PAKET HEALING SENDIRI.jpg'
  },
  {
    id: 'pkg-11',
    name: 'PAKET HEALING BERDUA',
    contents: [
      '1 Tenda (kapasitas 2/3 atau 4/5)',
      '2 Kursi Lipat XXL',
      '1 Tripod + Remote',
      '1 Meja Lipat'
    ],
    price: 55000,
    stock: 8,
    availableStock: 8,
    image: '/assets/images/PAKET HEALING BERDUA.jpg'
  },
  {
    id: 'pkg-10',
    name: 'PAKET HEALING RAME',
    contents: [
      '1 Tenda (kapasitas 2/3 atau 4/5)',
      '4 Kursi Lipat XXL',
      '1 Tripod + Remote',
      '1 Meja Lipat'
    ],
    price: 75000,
    stock: 8,
    availableStock: 8,
    image: '/assets/images/PAKET HEALING RAMEAN.jpg'
  }
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    username: 'Budi Santoso',
    avatar: '/assets/images/photo-1535713875002-d1d0cf377fde.jpg',
    rating: 5,
    comment: 'Barang-barang sangat terawat dan bersih. Tenda tidak bocor sama sekali waktu hujan deras di Ranu Kumbolo! Recommended banget.',
    date: '2026-06-15',
    image: '/assets/images/photo-1478131143081-80f7f84ca84d.jpg'
  },
  {
    id: 'rev-2',
    username: 'Siti Rahma',
    avatar: '/assets/images/photo-1494790108377-be9c29b29330.jpg',
    rating: 5,
    comment: 'Sewa Paket Healing Rame buat camping keluarga di Bululawang. Praktis banget tinggal angkut, alat masaknya lengkap. CS-nya ramah!',
    date: '2026-06-18',
    image: '/assets/images/photo-1504280390367-361c6d9f38f4.jpg'
  },
  {
    id: 'rev-3',
    username: 'Andi Wijaya',
    avatar: '/assets/images/photo-1599566150163-29194dcaad36.jpg',
    rating: 4,
    comment: 'Alatnya bagus, bersih, dan fungsional. Sangat terbantu buat pemula yang pengen coba camping tanpa harus beli alat mahal.',
    date: '2026-06-20',
    image: '/assets/images/photo-1510312305653-8ed496efae75.jpg'
  }
];

export class DbStore {
  private static data: DbSchema = {
    items: [],
    packages: [],
    orders: [],
    reviews: []
  };

  public static initialize(): void {
    try {
      // Ensure directory exists
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        DbStore.data = JSON.parse(raw);
        
        // Safety checks to ensure we have all lists
        if (!DbStore.data.items) DbStore.data.items = SEED_ITEMS;
        if (!DbStore.data.packages) DbStore.data.packages = SEED_PACKAGES;
        if (!DbStore.data.orders) DbStore.data.orders = [];
        if (!DbStore.data.reviews) DbStore.data.reviews = SEED_REVIEWS;
      } else {
        DbStore.data = {
          items: SEED_ITEMS,
          packages: SEED_PACKAGES,
          orders: [],
          reviews: SEED_REVIEWS
        };
        DbStore.save();
      }
    } catch (e) {
      console.error('Error initializing dbStore, using in-memory fallbacks:', e);
      DbStore.data = {
        items: SEED_ITEMS,
        packages: SEED_PACKAGES,
        orders: [],
        reviews: SEED_REVIEWS
      };
    }
  }

  private static save(): void {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(DbStore.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db file:', e);
    }
  }

  // Items
  public static getItems(): Item[] {
    return DbStore.data.items;
  }

  public static saveItem(item: Item): void {
    const idx = DbStore.data.items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      // Retain correct availableStock logic or reset if changed
      const oldItem = DbStore.data.items[idx];
      const diffStock = item.stock - oldItem.stock;
      item.availableStock = Math.max(0, oldItem.availableStock + diffStock);
      DbStore.data.items[idx] = item;
    } else {
      item.availableStock = item.stock;
      DbStore.data.items.push(item);
    }
    DbStore.save();
  }

  public static deleteItem(id: string): void {
    DbStore.data.items = DbStore.data.items.filter(i => i.id !== id);
    DbStore.save();
  }

  // Packages
  public static getPackages(): Package[] {
    return DbStore.data.packages;
  }

  public static savePackage(pkg: Package): void {
    const idx = DbStore.data.packages.findIndex(p => p.id === pkg.id);
    if (idx >= 0) {
      const oldPkg = DbStore.data.packages[idx];
      const diffStock = pkg.stock - oldPkg.stock;
      pkg.availableStock = Math.max(0, oldPkg.availableStock + diffStock);
      DbStore.data.packages[idx] = pkg;
    } else {
      pkg.availableStock = pkg.stock;
      DbStore.data.packages.push(pkg);
    }
    DbStore.save();
  }

  public static deletePackage(id: string): void {
    DbStore.data.packages = DbStore.data.packages.filter(p => p.id !== id);
    DbStore.save();
  }

  // Orders
  public static getOrders(): Order[] {
    return DbStore.data.orders;
  }

  public static createOrder(order: Order): Order {
    // Process stock automatic deduction if the order status is Active or Pending
    // Let's deduct on order creation by default to secure reservations
    order.items.forEach(orderItem => {
      if (orderItem.isPackage) {
        const pkg = DbStore.data.packages.find(p => p.id === orderItem.id);
        if (pkg) {
          pkg.availableStock = Math.max(0, pkg.availableStock - orderItem.quantity);
        }
      } else {
        const it = DbStore.data.items.find(i => i.id === orderItem.id);
        if (it) {
          it.availableStock = Math.max(0, it.availableStock - orderItem.quantity);
        }
      }
    });

    DbStore.data.orders.push(order);
    DbStore.save();
    return order;
  }

  public static updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const order = DbStore.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    const oldStatus = order.status;
    order.status = status;

    // Automatic Stock Management System:
    // If transitioning from Pending/Active -> Cancelled or Completed: return stock
    // If transitioning from Cancelled/Completed -> Pending/Active: deduct stock
    const isRelinquished = (s: Order['status']) => s === 'Completed' || s === 'Cancelled';
    const isReserved = (s: Order['status']) => s === 'Pending' || s === 'Active';

    if (isReserved(oldStatus) && isRelinquished(status)) {
      // Re-add to stock (returned or cancelled)
      order.items.forEach(orderItem => {
        if (orderItem.isPackage) {
          const pkg = DbStore.data.packages.find(p => p.id === orderItem.id);
          if (pkg) {
            pkg.availableStock = Math.min(pkg.stock, pkg.availableStock + orderItem.quantity);
          }
        } else {
          const it = DbStore.data.items.find(i => i.id === orderItem.id);
          if (it) {
            it.availableStock = Math.min(it.stock, it.availableStock + orderItem.quantity);
          }
        }
      });
    } else if (isRelinquished(oldStatus) && isReserved(status)) {
      // Re-deduct from stock (re-activated)
      order.items.forEach(orderItem => {
        if (orderItem.isPackage) {
          const pkg = DbStore.data.packages.find(p => p.id === orderItem.id);
          if (pkg) {
            pkg.availableStock = Math.max(0, pkg.availableStock - orderItem.quantity);
          }
        } else {
          const it = DbStore.data.items.find(i => i.id === orderItem.id);
          if (it) {
            it.availableStock = Math.max(0, it.availableStock - orderItem.quantity);
          }
        }
      });
    }

    DbStore.save();
    return order;
  }

  // Reviews & Gallery
  public static getReviews(): Review[] {
    return DbStore.data.reviews;
  }

  public static addReview(review: Review): void {
    DbStore.data.reviews.unshift(review); // Prepend to show latest first
    DbStore.save();
  }

  // Stats
  public static getStats(): DashboardStats {
    const items = DbStore.getItems();
    const packages = DbStore.getPackages();
    const orders = DbStore.getOrders();

    // Total unique items available for rent
    const totalItems = items.length + packages.length;
    
    // Sum of stock elements that are ready
    let availableItems = 0;
    items.forEach(i => availableItems += i.availableStock);
    packages.forEach(p => availableItems += p.availableStock);

    // Rented items = sum of items in active orders
    let rentedItems = 0;
    orders.filter(o => o.status === 'Active').forEach(o => {
      o.items.forEach(oi => rentedItems += oi.quantity);
    });

    // Total completed or active transactions
    const totalTransactions = orders.filter(o => o.status !== 'Cancelled').length;

    // Total distinct customers by name
    const uniqueCustomers = new Set(orders.map(o => o.customerName.toLowerCase().trim()));
    const totalCustomers = uniqueCustomers.size || orders.length;

    return {
      totalItems,
      availableItems,
      rentedItems,
      totalTransactions,
      totalCustomers
    };
  }
}
