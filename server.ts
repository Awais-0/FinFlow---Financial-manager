import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { query } from './src/lib/db.ts';
import { hashPassword, comparePassword, signToken } from './src/lib/auth.ts';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- Auth Routes ---
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2)
      }).parse(req.body);

      const hashed = await hashPassword(password);
      
      const [result]: any = await query(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashed, name]
      );

      res.status(201).json({ id: result.insertId, email, name });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = z.object({
        email: z.string().email(),
        password: z.string()
      }).parse(req.body);

      const [users]: any = await query('SELECT * FROM users WHERE email = ?', [email]);
      const user = users[0];

      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = signToken({ id: user.id, email: user.email });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      res.status(400).json({ error: 'Login failed' });
    }
  });

  // --- Finance Routes ---
  app.get('/api/transactions', async (req, res) => {
    try {
      // In a real app, you'd filter by userId from JWT
      const [rows] = await query('SELECT * FROM transactions ORDER BY date DESC LIMIT 20');
      res.json(rows);
    } catch (error) {
      res.json([]); // Fallback during dev if table doesn't exist yet
    }
  });

  app.post('/api/transactions', async (req, res) => {
    try {
      const { amount, category_id, description, date, type, account_id, user_id } = req.body;
      const [result]: any = await query(
        'INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, account_id, category_id, amount, type, description, date]
      );
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create transaction' });
    }
  });

  app.get('/api/budgets', async (req, res) => {
    try {
      const [rows] = await query('SELECT b.*, c.name as category_name FROM budgets b JOIN categories c ON b.category_id = c.id');
      res.json(rows);
    } catch (error) {
      res.json([]);
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
