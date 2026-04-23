import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { query, getPool } from './src/lib/db.ts';
import { hashPassword, comparePassword, signToken, authMiddleware } from './src/lib/auth.ts';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3200;

app.use(cors());
app.use(express.json());

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
    }).parse(req.body);

    const hashed = await hashPassword(password);

    const [result]: any = await query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashed, name]
    );

    const token = signToken({ id: result.insertId, email, name });
    res.status(201).json({ token, user: { id: result.insertId, email, name } });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = z.object({
      email: z.string().email(),
      password: z.string(),
    }).parse(req.body);

    const [users]: any = await query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req: any, res) => {
  try {
    const [users]: any = await query('SELECT id, email, name, currency FROM users WHERE id = ?', [req.user.id]);
    if (!users[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: users[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// --- Finance Routes (protected) ---
app.get('/api/transactions', authMiddleware, async (req: any, res) => {
  try {
    const [rows] = await query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 50',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', authMiddleware, async (req: any, res) => {
  try {
    const { amount, category_id, description, date, type, account_id } = z.object({
      amount: z.number().min(0.01),
      category_id: z.number(),
      description: z.string().optional(),
      date: z.string(),
      type: z.enum(['income', 'expense', 'transfer']),
      account_id: z.number(),
    }).parse(req.body);

    const [result]: any = await query(
      'INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, account_id, category_id, amount, type, description || null, date]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create transaction' });
  }
});

app.get('/api/budgets', authMiddleware, async (req: any, res) => {
  try {
    const [rows] = await query(
      `SELECT b.*, c.name as category_name
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// --- Vite Middleware ---
async function startServer() {
  // Initialize database and tables before starting server
  try {
    await getPool();
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
