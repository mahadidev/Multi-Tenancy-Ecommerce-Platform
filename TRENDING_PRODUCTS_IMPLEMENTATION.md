# Trending Products Implementation

This document outlines the implementation of the new minimal design trending products feature with a dedicated API.

## Features Implemented

### Backend API
- **Controller**: `app/Modules/AnalyticsManagement/Controllers/TrendingProductsController.php`
- **Service**: `app/Modules/AnalyticsManagement/Services/TrendingProductsService.php`
- **Endpoint**: `POST /api/v1/seller/analytics/trending-products`

### Frontend Components
- **Main Component**: `resources/js/seller/pages/DashboardPageV2/TrendingProducts/TrendingProducts.tsx`
- **Product Table**: `resources/js/seller/pages/DashboardPageV2/TrendingProducts/components/ProductTable.tsx`
- **Product Card**: `resources/js/seller/pages/DashboardPageV2/TrendingProducts/components/ProductCard.tsx` (legacy)
- **Filter Tabs**: `resources/js/seller/pages/DashboardPageV2/TrendingProducts/components/FilterTabs.tsx`
- **Time Range Select**: `resources/js/seller/pages/DashboardPageV2/TrendingProducts/components/TimeRangeSelect.tsx`
- **Image Placeholder**: `resources/js/seller/components/ProductImagePlaceholder.tsx`
- **Updated Hook**: `resources/js/seller/hooks/useTrendingProducts.ts`

## API Features

### Filter Types
- `top_selling` - Sort by total quantity sold
- `most_revenue` - Sort by total revenue generated
- `most_profitable` - Sort by estimated profit (30% margin)
- `recently_popular` - Sort by order count and quantity

### Time Ranges
- `today` - Today's data
- `last7days` - Last 7 days
- `last30days` - Last 30 days
- `last1year` - Last year

### Pagination
- Supports page-based pagination
- Configurable limit (default: 6-8 items)
- Returns `has_more` flag for infinite scroll

## UX Improvements

### Clean Table Design
- Professional table-based layout
- Compact and information-dense
- Mobile-responsive with hidden columns
- Color-coded ranking system (Gold, Silver, Bronze)
- Inline product thumbnails with placeholders
- Clear typography hierarchy

### Performance Optimizations
- Dedicated API endpoint
- Efficient database queries with proper indexing
- Lazy loading with pagination
- Optimized React components

### User Experience
- Tab-based filtering
- Smooth loading states
- Error handling with retry options
- Responsive grid layout

## Technical Details

### Database Queries
- Uses `order_items` table with proper joins
- Filters by order status (excludes cancelled)
- Aggregates quantity, revenue, and order count
- Groups by product_id

### Authentication
- Requires `auth:sanctum` middleware
- Uses `store` middleware for store context
- Permission-based access control

### Error Handling
- Graceful fallbacks to mock data in development
- User-friendly error messages
- Retry mechanisms for failed requests

## Usage

The trending products component is integrated into the Dashboard V2 and provides real-time insights into product performance based on actual order data.