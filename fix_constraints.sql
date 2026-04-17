-- First, update existing data to fit the new constraints

-- Update existing orders with NULL or invalid status to ORDER_PLACED
UPDATE orders SET status = 'ORDER_PLACED' WHERE status IS NULL OR status NOT IN ('ORDER_PLACED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'ORDER_COMPLETED');

-- Update existing users with NULL source to OFFLINE (since they were existing before the system tracked this)
UPDATE users SET source = 'OFFLINE' WHERE source IS NULL;

-- Now add the constraints
ALTER TABLE users ADD CONSTRAINT source_check CHECK (source IN ('PICKUP', 'OFFLINE', 'FRANCHISE', 'STALL'));
ALTER TABLE orders ADD CONSTRAINT status_check CHECK (status IN ('ORDER_PLACED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'ORDER_COMPLETED'));