-- Add payment tracking columns to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';
ALTER TABLE items ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE items ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE items ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'paypal';

-- Add index for payment status
CREATE INDEX IF NOT EXISTS idx_items_payment_status ON items(payment_status);

-- Comments
COMMENT ON COLUMN items.payment_status IS 'Payment status: unpaid, paid, refunded, failed';
COMMENT ON COLUMN items.transaction_id IS 'Transaction ID from payment provider (e.g. PayPal capture ID)';
