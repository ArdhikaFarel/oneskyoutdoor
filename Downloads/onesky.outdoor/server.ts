/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DbStore } from './src/dbStore';
import { Item, Package, Order, Review } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB store (loads/seeds src/db.json)
  DbStore.initialize();

  // JSON and URL-encoded body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger for debugging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // --- API ROUTES ---

  // Admin Authentication
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'ferdyonesky@outdoor.com' && password === 'oneskyoutdooradmin') {
      return res.status(200).json({
        success: true,
        token: 'onesky-admin-secure-token-2026',
        user: {
          email: 'ferdyonesky@outdoor.com',
          role: 'admin',
          name: 'OneSky Administrator'
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  });

  // Admin Route Protection Middleware
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer onesky-admin-secure-token-2026') {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    }
  };

  // Stats
  app.get('/api/stats', (req, res) => {
    try {
      const stats = DbStore.getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Items
  app.get('/api/items', (req, res) => {
    try {
      res.json(DbStore.getItems());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/items', requireAdmin, (req, res) => {
    try {
      const itemData: Omit<Item, 'id' | 'availableStock'> = req.body;
      const newItem: Item = {
        ...itemData,
        id: `item-${Date.now()}`,
        availableStock: itemData.stock
      };
      DbStore.saveItem(newItem);
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/items/:id', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const itemData: Omit<Item, 'id'> = req.body;
      const existingItems = DbStore.getItems();
      const existing = existingItems.find(i => i.id === id);
      
      if (!existing) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const updatedItem: Item = {
        ...itemData,
        id
      };
      DbStore.saveItem(updatedItem);
      res.json(updatedItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/items/:id', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      DbStore.deleteItem(id);
      res.json({ success: true, message: 'Item deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Packages
  app.get('/api/packages', (req, res) => {
    try {
      res.json(DbStore.getPackages());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/packages', requireAdmin, (req, res) => {
    try {
      const pkgData: Omit<Package, 'id' | 'availableStock'> = req.body;
      const newPkg: Package = {
        ...pkgData,
        id: `pkg-${Date.now()}`,
        availableStock: pkgData.stock
      };
      DbStore.savePackage(newPkg);
      res.status(201).json(newPkg);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/packages/:id', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const pkgData: Omit<Package, 'id'> = req.body;
      const existingPackages = DbStore.getPackages();
      const existing = existingPackages.find(p => p.id === id);

      if (!existing) {
        return res.status(404).json({ error: 'Package not found' });
      }

      const updatedPkg: Package = {
        ...pkgData,
        id
      };
      DbStore.savePackage(updatedPkg);
      res.json(updatedPkg);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/packages/:id', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      DbStore.deletePackage(id);
      res.json({ success: true, message: 'Package deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    try {
      res.json(DbStore.getOrders());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders', (req, res) => {
    try {
      const orderData: Omit<Order, 'id' | 'status' | 'createdAt'> = req.body;
      const newOrder: Order = {
        ...orderData,
        id: `ord-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      const saved = DbStore.createOrder(newOrder);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = DbStore.updateOrderStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    try {
      res.json(DbStore.getReviews());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/reviews', (req, res) => {
    try {
      const reviewData: Omit<Review, 'id' | 'date'> = req.body;
      const newReview: Review = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
      };
      DbStore.addReview(newReview);
      res.status(201).json(newReview);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- INTEGRATION OF FRONTEND MIDDLEWARE / STATIC SERVING ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA Fallback for production React router
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 and PORT 3000 as mandated by the container runtime
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OneSky Outdoor running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch(err => {
  console.error('Failed to start OneSky Outdoor server:', err);
});
