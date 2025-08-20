-- EMERGENCY DATABASE OPTIMIZATION FOR PRODUCT_STOCK_HISTORIES TABLE
-- Run these commands IMMEDIATELY to fix the timeout issue

-- 1. Add essential indexes for the stock history queries
ALTER TABLE product_stock_histories ADD INDEX idx_created_at (created_at);
ALTER TABLE product_stock_histories ADD INDEX idx_product_id (product_id);
ALTER TABLE product_stock_histories ADD INDEX idx_type (type);
ALTER TABLE product_stock_histories ADD INDEX idx_product_created (product_id, created_at);

-- 2. Check table size (run this to see how many records exist)
SELECT COUNT(*) as total_records FROM product_stock_histories;
SELECT COUNT(*) as records_last_week FROM product_stock_histories WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- 3. If table is very large (>100k records), consider archiving old data
-- BACKUP old records first before deleting
-- CREATE TABLE product_stock_histories_archive AS SELECT * FROM product_stock_histories WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
-- DELETE FROM product_stock_histories WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- 4. Optimize table after cleanup
OPTIMIZE TABLE product_stock_histories;

-- 5. Check query performance after indexes
EXPLAIN SELECT psh.*, p.name, p.thumbnail, p.stockBuyingValue, p.stockValue 
FROM product_stock_histories psh 
JOIN products p ON psh.product_id = p.id 
WHERE psh.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
ORDER BY psh.created_at DESC 
LIMIT 10;