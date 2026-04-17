-- Step 1: Create the enum types (if they don't exist)
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

-- Step 2: First, drop the default (if any) so conversion can happen
ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;

-- Step 3: Update all existing values to a valid enum value first
UPDATE orders SET status = 'ORDER_PLACED' 
WHERE status IS NULL 
   OR status::text NOT IN ('ORDER_PLACED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'ORDER_COMPLETED');

-- Step 4: Now alter the column type (should work after values are valid)
ALTER TABLE orders ALTER COLUMN status TYPE public.order_status USING status::text::public.order_status;

-- Step 5: Set a default for new orders
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'ORDER_PLACED'::public.order_status;

-- Step 6: Add source column to users (if not exists)
-- First check if column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'source'
    ) THEN
        ALTER TABLE users ADD COLUMN source public.user_source;
    END IF;
END $$;

-- Step 7: Update existing null source values
UPDATE users SET source = 'OFFLINE'::public.user_source WHERE source IS NULL;

-- Step 8: Add outlet_id column to users (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'outlet_id'
    ) THEN
        ALTER TABLE users ADD COLUMN outlet_id INTEGER REFERENCES outlets(id);
    END IF;
END $$;