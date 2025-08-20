-- RUN THESE IMMEDIATELY TO FIX API SPEED
-- These indexes will make the stock history API respond in <1 second

-- Check if indexes already exist (run this first)
SHOW INDEX FROM product_stock_histories;

-- Add essential indexes for stock history queries
ALTER TABLE product_stock_histories ADD INDEX IF NOT EXISTS idx_created_at (created_at);
ALTER TABLE product_stock_histories ADD INDEX IF NOT EXISTS idx_product_id (product_id);

-- Check table size to understand the performance issue
SELECT 
    COUNT(*) as total_records,
    MAX(created_at) as latest_record,
    MIN(created_at) as oldest_record
FROM product_stock_histories;

-- Test the query performance after adding indexes
EXPLAIN SELECT * FROM product_stock_histories 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
ORDER BY created_at DESC 
LIMIT 10;