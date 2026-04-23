import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'finflow_db';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');

let pool: mysql.Pool | null = null;

async function initDatabase() {
  // First connect without specifying a database to create it
  const tempPool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 1,
  });

  try {
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`Database '${DB_NAME}' ready`);
  } catch (err) {
    console.error('Failed to create database:', err);
    throw err;
  }
  await tempPool.end();

  // Now create the main pool with the database
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Test connection
  await pool.getConnection().then(conn => conn.release());
  console.log(`Connected to MySQL database '${DB_NAME}'`);

  // Create tables
  await createTables();
}

async function createTables() {
  if (!pool) throw new Error('Pool not initialized');

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      type ENUM('checking', 'savings', 'credit_card', 'investment', 'debt') NOT NULL,
      balance DECIMAL(15, 2) DEFAULT 0.00,
      currency VARCHAR(10) DEFAULT 'USD',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      name VARCHAR(100) NOT NULL,
      type ENUM('income', 'expense') NOT NULL,
      icon VARCHAR(50),
      color VARCHAR(7)
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      account_id INT NOT NULL,
      category_id INT NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      type ENUM('income', 'expense', 'transfer') NOT NULL,
      description VARCHAR(255),
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`,
    `CREATE TABLE IF NOT EXISTS budgets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      category_id INT NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      period ENUM('monthly', 'yearly') DEFAULT 'monthly',
      start_date DATE NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`,
    `CREATE TABLE IF NOT EXISTS goals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      target_amount DECIMAL(15, 2) NOT NULL,
      current_amount DECIMAL(15, 2) DEFAULT 0.00,
      deadline DATE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
  ];

  for (const sql of tables) {
    await pool.execute(sql);
  }
  console.log('All tables ready');

  // Seed default categories if none exist
  const [rows]: any = await pool.execute('SELECT COUNT(*) as count FROM categories');
  if (rows[0].count === 0) {
    const defaultCategories = [
      ['Salary', 'income', 'DollarSign', '#0A84FF'],
      ['Food', 'expense', 'Utensils', '#FF453A'],
      ['Transport', 'expense', 'Car', '#FF9F0A'],
      ['Entertainment', 'expense', 'Film', '#30D158'],
      ['Utilities', 'expense', 'Zap', '#5AC8FA'],
      ['Subscription', 'expense', 'Repeat', '#BF5AF2'],
      ['Shopping', 'expense', 'ShoppingBag', '#FF2D55'],
      ['Healthcare', 'expense', 'Heart', '#FF375F'],
      ['Investment', 'income', 'TrendingUp', '#30D158'],
    ];

    for (const [name, type, icon, color] of defaultCategories) {
      await pool.execute(
        'INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)',
        [name, type, icon, color]
      );
    }
    console.log('Default categories seeded');
  }
}

export async function getPool(): Promise<mysql.Pool> {
  if (!pool) {
    await initDatabase();
  }
  return pool!;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<[T, mysql.FieldPacket[]]> {
  const p = await getPool();
  return p.execute(sql, params) as Promise<[T, mysql.FieldPacket[]]>;
}
