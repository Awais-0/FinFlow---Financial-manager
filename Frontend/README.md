# FinFlow - Personal Finance Management

A full-stack finance management app built with React, Vite, Express, and MySQL.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Recharts, Motion
- **Backend**: Express.js, TypeScript (tsx)
- **Database**: MySQL
- **Auth**: JWT + bcryptjs
- **Build**: Vite 6

## Setup

### 1. Start MySQL

If using **XAMPP**: Open XAMPP Control Panel and click **Start** next to MySQL.

### 2. Configure environment variables

Copy `.env.example` to `.env` and update with your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env` (especially `DB_PASSWORD` if you have one set in XAMPP):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=finflow_db
DB_PORT=3306
JWT_SECRET=your_secure_secret_here_change_in_production
```

### 3. Install dependencies

```bash
cd D:/My_Projects/FinFlow/client
npm install
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3200`.

**No manual database setup needed** — the server automatically creates the `finflow_db` database and all tables on first startup.

## Available Scripts

- `npm run dev` - Start development server (with auto DB init)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Type-check with TypeScript
