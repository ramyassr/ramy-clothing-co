# Ramy Clothing Co. 👕

A retail web application. This app features a React frontend and a Node.js/TypeScript backend powered by a local SQLite database. 

Designed for a brand that values simplicity, the store exclusively features essentials in **Black, Grey, and White**.

---

## 🚀 Quick Start (For Local Testing)

To get the app running on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/ramyassr/ramy-clothing-co.git](https://github.com/ramyassr/ramy-clothing-co.git)
cd ramy-clothing-co
```
### 2. Setup the Backend
Open a terminal and run:
```bash
cd backend
npm install
# Start the server
npx ts-node server.ts
```
The API will be live at http://localhost:5000

### 3. Setup the Frontend
Open a second terminal and run:
```bash
cd frontend
npm install
# Start the Vite dev server
npm run dev
```
The Storefront will be live at http://localhost:5173

## ✨ Features
🛍️ Storefront

Welcome Widget: A branded landing section introducing Ramy Clothing Co.

Dynamic Filtering: Filter the clothing display by Color (Black, Grey, White) and Size (Small, Medium, Large).

Infinite Catalog: The UI automatically scales to display any number of items added to the database.

🛒 Shopping Cart

Add to Cart: Add items instantly without page refreshes.

Quantity Management: Update or remove items directly in the sidebar.

Dynamic Pricing: Real-time calculation of subtotals and totals based on item quantity.

Checkout Flow: A multi-step checkout process that captures customer shipping details.

🔐 Admin Dashboard

Live Inventory View: A table showing exactly what is currently in your local SQLite database.

Direct Entry: Add new products to the database via a simple form.

Permanent Delete: Remove old or test data from the SQLite file with one click.

## 🛠️ Tech Stack
Frontend: React, TypeScript, Vite

Backend: Node.js, Express, TypeScript

Database: SQLite (via better-sqlite3)

Styling: Modern CSS-in-JS (Inline Styles)

📝 Note for Testers

Since the database file (retail.db) is pre-populated, you will start with a basic data in the store.

To test the app:

1. Scroll to the bottom of the landing page.
2. Click "Open Admin Panel".
3. Add a few items (e.g., "Black Hoodie", "Grey Tee").
4. Watch them appear instantly in the store grid!
5. Click the "Add to Cart" button.
6. Watch them appear on your cart with cost auto-calculated.
7. Edit cart and see cost and item count adjusted
8. Click the "Checkout" button.
9. Enter details on the checkout page which will mock the payment for now.
