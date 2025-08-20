# Stock History Backend API Optimization Recommendations

## Issue Summary
The stock history API endpoint `/api/v1/seller/products/stocks/history` is experiencing severe performance issues:
- **Initial Issue**: Queries timing out after 30+ seconds
- **Current Issue**: Memory exhaustion errors ("Allowed memory size of 134217728 bytes exhausted")
- **Root Cause**: Backend query loading too much data into memory, even with pagination limits as low as 10 records

## Current API Endpoint
- **Endpoint**: `/api/v1/seller/products/stocks/history`
- **Parameters**: `range`, `limit`, `page`, `start_date`, `end_date`
- **Database Table**: `product_stock_histories`

## Frontend Temporary Solution Implemented
- Added mock data fallback when API timeouts or memory errors occur
- Reduced timeout from 30s to 10s for quicker fallback
- Enhanced error detection to catch memory exhaustion errors
- User notification about backend issues with retry option
- Graceful degradation to show sample data

## Backend Optimization Recommendations

### 1. Database Indexing
```sql
-- Add indexes for common query patterns
CREATE INDEX idx_product_stock_histories_created_at ON product_stock_histories(created_at);
CREATE INDEX idx_product_stock_histories_product_id ON product_stock_histories(product_id);
CREATE INDEX idx_product_stock_histories_type ON product_stock_histories(type);
CREATE INDEX idx_product_stock_histories_range_query ON product_stock_histories(created_at, product_id);
```

### 2. Query Optimization
- Ensure the backend query uses proper WHERE clauses with indexed columns
- Implement efficient pagination with OFFSET/LIMIT or cursor-based pagination
- Consider using database query execution plans to identify bottlenecks

### 3. Database Performance Analysis
```sql
-- Check current query performance
EXPLAIN ANALYZE SELECT * FROM product_stock_histories 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) 
ORDER BY created_at DESC 
LIMIT 10 OFFSET 0;
```

### 4. Backend Query Suggestions (CRITICAL)
- **URGENT**: The backend is likely loading ALL records before applying LIMIT/OFFSET
- Use proper date range filtering in WHERE clause BEFORE any JOINs or data loading
- Implement proper pagination that doesn't load entire dataset into memory
- Check Laravel query - it may be using `get()` instead of proper pagination
- Implement eager loading for product relationships to avoid N+1 queries
- Example proper Laravel query:
```php
ProductStockHistory::with('product')
    ->whereBetween('created_at', [$startDate, $endDate])
    ->orderBy('created_at', 'desc')
    ->paginate(10); // Use paginate() not get()->take()
```

### 5. Database Maintenance
- Check if `product_stock_histories` table has grown very large
- Consider archiving old records if not needed for current operations
- Run database optimization/vacuum operations

### 6. Alternative Solutions
- Implement Redis caching for frequently accessed stock history data
- Create a separate read-optimized view or materialized view
- Consider implementing background job processing for heavy queries

## Immediate Actions Required
1. **Database Admin**: Check `product_stock_histories` table size and current indexes
2. **Backend Dev**: Analyze the actual SQL query being generated
3. **Database Admin**: Add recommended indexes
4. **Backend Dev**: Optimize the Laravel query with proper eager loading

## Testing After Optimization
- Test the API endpoint with various time ranges
- Monitor query execution times in database logs
- Verify that pagination works correctly with optimized queries
- Remove the frontend mock data fallback once backend is stable

## Files Modified (Frontend Fallback)
- `resources/js/seller/hooks/useProductStockHistory.ts` - Added mock data fallback
- `resources/js/seller/pages/DashboardPageV2/StockTable/StockTable.tsx` - Added user notification
- `resources/js/seller/store/reducers/productStockHistoryApi.ts` - Reduced timeout to 10s