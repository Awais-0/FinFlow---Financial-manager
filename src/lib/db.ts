import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool | null = null;

export async function getPool(): Promise<mysql.Pool> {
  if (!pool) {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'finflow_db',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    try {
      pool = mysql.createPool(config);
      // Test connection
      await pool.getConnection();
      console.log('Successfully connected to MySQL');
    } catch (error) {
      console.error('Failed to connect to MySQL:', error);
      throw new Error(`MySQL Connection Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<[T, mysql.FieldPacket[]]> {
  const p = await getPool();
  return p.execute(sql, params) as Promise<[T, mysql.FieldPacket[]]>;
}
