# Deployment Guide - Vercel + Neon/Supabase PostgreSQL

## Prerequisites
- Vercel account
- Neon or Supabase account (for PostgreSQL)
- Git installed locally

---

## Step 1: Set Up Production Database

### Option A: Neon (Recommended - Free Tier)
1. Go to [Neon](https://neon.tech) and sign up
2. Create a new project: "fruit-shop-greams-road"
3. Copy the connection string (looks like: `postgres://user:pass@ep-xyz.us-east-1.aws.neon.tech/fruitshop`)

### Option B: Supabase
1. Go to [Supabase](https://supabase.com) and sign up
2. Create a new project
3. Go to Settings → Database → Connection String

---

## Step 2: Update Database Schema

Connect to your production database and run:

```sql
-- Create enum types
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE public.order_status AS ENUM ('ORDER_PLACED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'ORDER_COMPLETED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_source') THEN
        CREATE TYPE public.user_source AS ENUM ('PICKUP', 'OFFLINE', 'FRANCHISE', 'STALL');
    END IF;
END $$;

-- Add columns to users
ALTER TABLE users ADD COLUMN source public.user_source;
ALTER TABLE users ADD COLUMN outlet_id INTEGER REFERENCES outlets(id);

-- Update existing data
UPDATE users SET source = 'OFFLINE'::public.user_source WHERE source IS NULL;

-- Drop default on orders status
ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;

-- Update existing order statuses
UPDATE orders SET status = 'ORDER_PLACED' WHERE status IS NULL;

-- Alter column type
ALTER TABLE orders ALTER COLUMN status TYPE public.order_status USING status::text::public.order_status;

-- Set default
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'ORDER_PLACED'::public.order_status;
```

---

## Step 3: Push Code to GitHub

```bash
cd fruitshopongreamsroad

# Initialize git (if not already done)
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/fruitshopongreamsroad.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite (or Other)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add Environment Variables:
   - `POSTGRES_URL` = your Neon/Supabase connection string
   - `VITE_API_URL` = leave empty (or set to `/api` for production)

6. Click "Deploy"

---

## Step 5: Verify Deployment

After deployment completes:
1. Your frontend will be at: `https://your-project.vercel.app`
2. Your API will be at: `https://your-project.vercel.app/api/*`

Test the endpoints:
- `GET https://your-project.vercel.app/api/outlets`
- `GET https://your-project.vercel.app/api/menu`

---

## Important Notes

1. **Environment Variables**: The API uses `process.env.POSTGRES_URL` or `process.env.DATABASE_URL` for database connection

2. **Local Development**: Create a `.env` file:
   ```
   POSTGRES_URL=your_local_postgres_connection_string
   VITE_API_URL=http://localhost:3001
   ```

3. **Vercel Serverless Functions**: The `/api` routes are automatically converted to Vercel serverless functions

4. **Cold Start**: First request after inactivity may take a few seconds

---

## Troubleshooting

### "Cannot find module 'pg'"
Add `"pg": "^8.11.5"` to the main package.json dependencies if missing.

### Database Connection Error
- Ensure POSTGRES_URL is set correctly in Vercel dashboard
- Check that your Neon/Supabase allows connections from Vercel IPs

### Build Errors
- Run `npm run build` locally first to check for errors
- Ensure all dependencies are in package.json