<?php

namespace App\Modules\ProductManagement\Services;

use App\Modules\ProductManagement\Models\Product;
use Illuminate\Support\Str;

class ProductThumbnailService
{
    /**
     * Generate a placeholder thumbnail path for products without images
     */
    public static function getPlaceholderThumbnail(Product $product): string
    {
        // Use existing images from your assets if available
        $placeholderImages = [
            '/images/seller/products/apple-imac-1.png',
            '/images/seller/products/apple-imac-2.png',
            '/images/seller/products/apple-imac-3.png',
        ];
        
        // Use product ID to consistently assign the same placeholder
        $index = $product->id % count($placeholderImages);
        return $placeholderImages[$index];
    }
    
    /**
     * Get thumbnail URL for a product
     */
    public static function getThumbnailUrl(Product $product): ?string
    {
        if ($product->thumbnail) {
            // If thumbnail exists, return it
            if (Str::startsWith($product->thumbnail, 'http')) {
                return $product->thumbnail;
            }
            return asset('storage/' . $product->thumbnail);
        }
        
        // Return placeholder for products without thumbnails
        return self::getPlaceholderThumbnail($product);
    }
    
    /**
     * Update product thumbnails to use local placeholders
     */
    public static function assignPlaceholderThumbnails(): void
    {
        $products = Product::whereNull('thumbnail')->get();
        
        foreach ($products as $product) {
            $product->thumbnail = self::getPlaceholderThumbnail($product);
            $product->save();
        }
    }
}