import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import { createCheckoutSession } from './payment.ts';

const app = express();
const db = new Database('retail.db');

app.use(cors()); // Allows React to talk to this server
app.use(express.json());

// Initialize Database Table
db.exec(`
  CREATE TABLE IF NOT EXISTS clothes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    color TEXT,
    size TEXT,
    price REAL
  )
`);

// // Seed data if empty
// const count = (db.prepare('SELECT COUNT(*) as count FROM clothes').get() as any).count;
// if (count === 0) {
//   const insert = db.prepare('INSERT INTO clothes (name, color, size, price) VALUES (?, ?, ?, ?)');
//   const colors = ['Black', 'Grey', 'White'];
//   const sizes = ['Small', 'Medium', 'Large'];
  
//   // Create 9 variations (3 colors x 3 sizes)
//   colors.forEach(c => {
//     sizes.forEach(s => {
//       insert.run(`${c} Signature Tee`, c, s, 29.99);
//     });
//   });
// }

// API: Get items with filters
app.get('/api/clothes', (req, res) => {
  const { color, size } = req.query;
  let query = "SELECT * FROM clothes WHERE 1=1";
  const params = [];

  if (color) { query += " AND color = ?"; params.push(color); }
  if (size) { query += " AND size = ?"; params.push(size); }

  const items = db.prepare(query).all(...params);
  res.json(items);
});

// Admin API: Add new content
// In a real app, you'd protect this with a password!
app.post('/api/admin/add', (req, res) => {
  const { name, color, size, price } = req.body;

  if (!name || !color || !size || !price) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const insert = db.prepare('INSERT INTO clothes (name, color, size, price) VALUES (?, ?, ?, ?)');
  const result = insert.run(name, color, size, price);

  res.json({ success: true, id: result.lastInsertRowid });
});

// Admin Route: Delete Item (Useful for management)
app.delete('/api/admin/delete/:id', (req, res) => {
  db.prepare('DELETE FROM clothes WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { cartItems } = req.body;
        const session = await createCheckoutSession(cartItems, db);
        res.json({ id: session.id, url: session.url });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log('Backend API at http://localhost:5000'));