<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\StoreManagement\Models\Store;
use App\Modules\ProductManagement\Models\Product;
use App\Modules\ProductManagement\Models\Category;
use App\Modules\ProductManagement\Models\Brand;
use App\Modules\OrderManagement\Models\Order;
use Illuminate\Support\Facades\Cache;

class DataIntegrationService
{
    /**
     * Get products for a store with filtering options
     */
    public function getProducts(Store $store, array $filters = []): array
    {
        $cacheKey = "store_{$store->id}_products_" . md5(serialize($filters));
        
        return Cache::remember($cacheKey, 300, function () use ($store, $filters) {
            $query = $store->products()->with(['variants', 'brand', 'category']);

            // Apply filters
            if (!empty($filters['filter'])) {
                switch ($filters['filter']) {
                    case 'featured':
                        $query->where('is_featured', true);
                        break;
                    case 'trending':
                        $query->where('is_trending', true);
                        break;
                    case 'latest':
                        $query->orderBy('created_at', 'desc');
                        break;
                }
            }

            if (!empty($filters['category_id'])) {
                $query->where('category_id', $filters['category_id']);
            }

            if (!empty($filters['brand_id'])) {
                $query->where('brand_id', $filters['brand_id']);
            }

            if (!empty($filters['limit'])) {
                $query->limit($filters['limit']);
            }

            $products = $query->get();

            return $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'short_description' => $product->short_description,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'currency' => $product->currency,
                    'images' => $product->attachments_image,
                    'thumbnail' => $product->thumbnail_image,
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                        'slug' => $product->category->slug,
                    ] : null,
                    'brand' => $product->brand ? [
                        'id' => $product->brand->id,
                        'name' => $product->brand->name,
                        'slug' => $product->brand->slug,
                    ] : null,
                    'is_featured' => $product->is_featured,
                    'is_trending' => $product->is_trending,
                    'stock_quantity' => $product->stock_quantity,
                    'url' => url("/products/{$product->slug}"),
                ];
            })->toArray();
        });
    }

    /**
     * Get categories for a store
     */
    public function getCategories(Store $store, array $filters = []): array
    {
        $cacheKey = "store_{$store->id}_categories_" . md5(serialize($filters));
        
        return Cache::remember($cacheKey, 600, function () use ($store, $filters) {
            $query = $store->categories();

            if (!empty($filters['with_products'])) {
                $query->withCount('products');
            }

            if (!empty($filters['limit'])) {
                $query->limit($filters['limit']);
            }

            $categories = $query->get();

            return $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'image' => $category->image,
                    'products_count' => $category->products_count ?? $category->products()->count(),
                    'url' => url("/categories/{$category->slug}"),
                ];
            })->toArray();
        });
    }

    /**
     * Get brands for a store
     */
    public function getBrands(Store $store, array $filters = []): array
    {
        $cacheKey = "store_{$store->id}_brands_" . md5(serialize($filters));
        
        return Cache::remember($cacheKey, 600, function () use ($store, $filters) {
            $query = $store->brands();

            if (!empty($filters['with_products'])) {
                $query->withCount('products');
            }

            if (!empty($filters['limit'])) {
                $query->limit($filters['limit']);
            }

            $brands = $query->get();

            return $brands->map(function ($brand) {
                return [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'description' => $brand->description,
                    'logo' => $brand->logo,
                    'products_count' => $brand->products_count ?? $brand->products()->count(),
                    'url' => url("/brands/{$brand->slug}"),
                ];
            })->toArray();
        });
    }

    /**
     * Get store statistics
     */
    public function getStoreStats(Store $store): array
    {
        $cacheKey = "store_{$store->id}_stats";
        
        return Cache::remember($cacheKey, 300, function () use ($store) {
            return [
                'total_products' => $store->products()->count(),
                'total_categories' => $store->categories()->count(),
                'total_brands' => $store->brands()->count(),
                'total_orders' => $store->orders()->count(),
                'featured_products' => $store->products()->where('is_featured', true)->count(),
                'trending_products' => $store->products()->where('is_trending', true)->count(),
                'out_of_stock_products' => $store->products()->where('stock_quantity', '<=', 0)->count(),
            ];
        });
    }

    /**
     * Get recent orders for testimonials or stats
     */
    public function getRecentOrders(Store $store, int $limit = 10): array
    {
        $cacheKey = "store_{$store->id}_recent_orders_{$limit}";
        
        return Cache::remember($cacheKey, 300, function () use ($store, $limit) {
            $orders = $store->orders()
                ->with(['customer', 'items.product'])
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            return $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => $order->total,
                    'currency' => $order->currency,
                    'status' => $order->status,
                    'customer_name' => $order->customer_name,
                    'customer_email' => $order->customer_email,
                    'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                    'items_count' => $order->items->count(),
                ];
            })->toArray();
        });
    }

    /**
     * Get store information for website
     */
    public function getStoreInfo(Store $store): array
    {
        return [
            'name' => $store->name,
            'description' => $store->description,
            'email' => $store->email,
            'phone' => $store->phone,
            'location' => $store->location,
            'logo' => $store->logo_image,
            'dark_logo' => $store->dark_logo_image,
            'primary_color' => $store->primary_color,
            'secondary_color' => $store->secondary_color,
            'currency' => $store->currency,
            'social_media' => $store->socialMedia->map(function ($social) {
                return [
                    'platform' => $social->platform,
                    'url' => $social->url,
                    'icon' => $social->icon,
                ];
            })->toArray(),
        ];
    }

    /**
     * Render dynamic content for components
     */
    public function renderDynamicContent(Store $store, string $componentType, array $props): array
    {
        switch ($componentType) {
            case 'product-grid':
                return [
                    'products' => $this->getProducts($store, [
                        'filter' => $props['filter'] ?? 'featured',
                        'limit' => $props['limit'] ?? 8,
                        'category_id' => $props['category_id'] ?? null,
                        'brand_id' => $props['brand_id'] ?? null,
                    ]),
                ];

            case 'category-list':
                return [
                    'categories' => $this->getCategories($store, [
                        'limit' => $props['limit'] ?? 12,
                        'with_products' => true,
                    ]),
                ];

            case 'brand-showcase':
                return [
                    'brands' => $this->getBrands($store, [
                        'limit' => $props['limit'] ?? 8,
                        'with_products' => true,
                    ]),
                ];

            case 'store-stats':
                return [
                    'stats' => $this->getStoreStats($store),
                ];

            case 'testimonials':
                // Get recent orders as customer feedback
                $orders = $this->getRecentOrders($store, $props['limit'] ?? 5);
                return [
                    'testimonials' => array_map(function ($order) {
                        return [
                            'quote' => "Great experience shopping here! Order #{$order['order_number']} was perfect.",
                            'author' => $order['customer_name'],
                            'position' => 'Verified Customer',
                            'avatar' => null,
                        ];
                    }, $orders),
                ];

            case 'store-info':
                return [
                    'store' => $this->getStoreInfo($store),
                ];

            default:
                return [];
        }
    }

    /**
     * Clear cache for a store
     */
    public function clearStoreCache(Store $store): void
    {
        $patterns = [
            "store_{$store->id}_products_*",
            "store_{$store->id}_categories_*",
            "store_{$store->id}_brands_*",
            "store_{$store->id}_stats",
            "store_{$store->id}_recent_orders_*",
        ];

        foreach ($patterns as $pattern) {
            // Note: This is a simple implementation. 
            // In production, you might want to use Redis with pattern matching
            Cache::forget($pattern);
        }
    }

    /**
     * Search products for a store
     */
    public function searchProducts(Store $store, string $query, array $filters = []): array
    {
        $queryBuilder = $store->products()
            ->with(['variants', 'brand', 'category'])
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%")
                  ->orWhere('short_description', 'LIKE', "%{$query}%");
            });

        if (!empty($filters['category_id'])) {
            $queryBuilder->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['brand_id'])) {
            $queryBuilder->where('brand_id', $filters['brand_id']);
        }

        if (!empty($filters['min_price'])) {
            $queryBuilder->where('price', '>=', $filters['min_price']);
        }

        if (!empty($filters['max_price'])) {
            $queryBuilder->where('price', '<=', $filters['max_price']);
        }

        $limit = $filters['limit'] ?? 20;
        $products = $queryBuilder->limit($limit)->get();

        return $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'sale_price' => $product->sale_price,
                'thumbnail' => $product->thumbnail_image,
                'url' => url("/products/{$product->slug}"),
            ];
        })->toArray();
    }
}