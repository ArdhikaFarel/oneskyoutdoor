# OneSky Outdoor - Fullstack Camping Equipment Rental Platform

**OneSky Outdoor** is a modern, high-fidelity fullstack web application for renting premium camping, hiking, and outdoor adventure gear. It features a stunning customer booking platform, a complete admin dashboard for inventory management, and a live SQLite-compatible file-based database store integrated with automatic stock updates.

## 🌟 Core Features

### 🛒 Customer Storefront
* **Dynamic Hero Metrics**: Displays real-time live metrics of total equipment types, available stock, and currently active bookings.
* **Combo Package Catalog**: Displays pre-arranged sets of camping gear (e.g., Paket Healing Rame, Solo Explorer) in a structured grid.
* **Single Item Catalog**: Showcases single items with categories (Tents, Cooking Stoves, Mattresses, Sleeping Bags, Lighting, etc.).
* **Advanced Cart System**: Real-time pricing calculations based on the selected rental start and return dates.
* **Automated WhatsApp Booking**: Formats itemized summaries, totals, and rental dates, then redirects customers to WhatsApp.
* **Terms & Conditions**: Beautiful accordion covering policies, deposits, and overtime rules.
* **Reviews & Adventure Gallery**: Responsive testimonials and photos. Customers can write and submit live reviews!
* **Google Maps Area**: Visual map representation of the store's Bululawang Malang pickup location.

### 🛡 Admin Dashboard Control Panel
* **Seeded Admin Credentials**: Login instantly using:
  * **Email**: `admin@onesky.com`
  * **Password**: `admin123`
* **Real-time Overview Widgets**: Charts and indicator cards summarizing stock levels, low-stock alerts, active rentals, total revenue transactions, and distinct customers.
* **Single Gear CRUD**: Form dialogs to add, edit, and delete single rental products with custom pricing and stocks.
* **Packages CRUD**: Form dialogs to manage package bundles, custom item configurations, and bundles stocks.
* **Live Booking Registry**: View all transaction bookings. Filter by statuses (`Pending`, `Active / Rented`, `Completed / Returned`, `Cancelled`).
* **Automated Stock Engine**:
  * marking an order as **Active (Rented)** automatically decreases available stock.
  * marking an order as **Completed (Returned)** or **Cancelled** instantly restores items to active inventory.

---

## 🛠 Technology Stack

* **Frontend**: React 19, Tailwind CSS, Lucide icons, Motion
* **Backend**: Node.js, Express.js (REST APIs & Vite Server Integration)
* **Database**: Lightweight JSON File Database (`src/db.json` with CRUD models in `src/dbStore.ts`)
* **Dev/Build Tooling**: Vite 6, `tsx` runner, `esbuild` compiler (bundling the Express backend as a self-contained `.cjs` script for production)

---

## 📂 Project Structure

```
OneSky-Outdoor/
├── server.ts              # Express API Server and Vite middleware controller
├── package.json           # Application dependencies and build scripts
├── metadata.json          # App metadata configurations
├── README.md              # Installation and run manual
├── tsconfig.json          # TypeScript definitions and path aliases
├── vite.config.ts         # Vite build configuration
└── src/
    ├── App.tsx            # Main frontend orchestrator with state & notification Toast
    ├── main.tsx           # React mounting entry point
    ├── index.css          # Tailwind CSS styles and Earth Tone palette config
    ├── types.ts           # Shared TypeScript models (Items, Packages, Orders, Reviews)
    ├── dbStore.ts         # Server-side database engine (Loads, saves, seeds data)
    ├── db.json            # Ephemeral file-based database (automatically created and seeded)
    └── components/
        ├── Navbar.tsx            # Responsive navigation & Admin/Customer view toggler
        ├── Hero.tsx              # Brand introduction, metrics loader, and scrolling
        ├── PackageCatalog.tsx    # Combo packages grid with stock badges
        ├── SingleItemCatalog.tsx # Individual items with category filters
        ├── CartModal.tsx         # Cart manager, date calculator, and WA generator
        ├── TermsAndConditions.tsx# Rules, overtime fees, and COD pickup guidelines
        ├── ReviewsAndGallery.tsx # Customer testimonials grid & review writer form
        ├── GoogleMapsEmbed.tsx   # Bululawang store pickup location mapping iframe
        ├── AdminLoginModal.tsx   # Credentials login validator (admin@onesky.com / admin123)
        └── AdminDashboard.tsx    # Summary widgets, Item CRUD, Package CRUD, Order filter
```

---

## 🚀 Getting Started & Execution

### 1. Installation
Clone or export the project, and install the required NPM dependencies:
```bash
npm install
```

### 2. Development Mode
To boot the Express server and Vite development bundler concurrently on the mandatory port `3000`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build and Start
To compile the client files and bundle the backend server into a production-ready standalone CommonJS script:
```bash
# Build Vite client assets + Bundle backend via esbuild
npm run build

# Start the compiled production app
npm run start
```
This serves compiled client assets in production and starts the API listening on port `3000`.

---

## 🔐 Credentials Reminder
Access the dashboard by clicking **Admin Login** in the top navigation bar:
* **Admin Email**: `admin@onesky.com`
* **Admin Password**: `admin123`
