/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Item {
  id: string;
  name: string;
  price: number;
  stock: number;
  availableStock: number;
  image: string;
  category: string;
}

export interface Package {
  id: string;
  name: string;
  contents: string[];
  price: number;
  stock: number;
  availableStock: number;
  image: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isPackage: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  rentalDate: string;
  returnDate: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  username: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  image?: string; // Optional field for review gallery photo
}

export interface DashboardStats {
  totalItems: number;
  availableItems: number;
  rentedItems: number;
  totalTransactions: number;
  totalCustomers: number;
}