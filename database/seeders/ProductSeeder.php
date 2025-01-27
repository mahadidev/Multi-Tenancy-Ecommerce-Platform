<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Store;
use App\Models\Category;
use App\Models\Brand;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $store = Store::with('brands', 'categories')->where('slug', 'goody-bro')->orWhere('domain', 'goody-bro')->first();

        if ($store) {
            $categories = $store->categories;
            $brands = $store->brands;

            $products = [
                [
                    'name' => 'iPhone 14 Pro',
                    'slug' => 'iphone-14-pro',
                    'sku' => 'IPH14PRO',
                    'price' => 999.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'electronics')->id,
                    'brand_id' => $brands->firstWhere('slug', 'apple')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Samsung Galaxy S23',
                    'slug' => 'samsung-galaxy-s23',
                    'sku' => 'GALAXYS23',
                    'price' => 849.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'electronics')->id,
                    'brand_id' => $brands->firstWhere('slug', 'samsung')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Nike Air Max 270',
                    'slug' => 'nike-air-max-270',
                    'sku' => 'NIKEAM270',
                    'price' => 129.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'clothing')->id,
                    'brand_id' => $brands->firstWhere('slug', 'nike')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Adidas Ultraboost',
                    'slug' => 'adidas-ultraboost',
                    'sku' => 'ADIBOOST',
                    'price' => 149.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'clothing')->id,
                    'brand_id' => $brands->firstWhere('slug', 'adidas')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Sony WH-1000XM5',
                    'slug' => 'sony-wh-1000xm5',
                    'sku' => 'SONYXM5',
                    'price' => 299.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'electronics')->id,
                    'brand_id' => $brands->firstWhere('slug', 'sony')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Microsoft Surface Pro 9',
                    'slug' => 'microsoft-surface-pro-9',
                    'sku' => 'SURFACEPRO9',
                    'price' => 1099.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'electronics')->id,
                    'brand_id' => $brands->firstWhere('slug', 'microsoft')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Gucci Leather Bag',
                    'slug' => 'gucci-leather-bag',
                    'sku' => 'GUCCIBAG01',
                    'price' => 1999.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'travel-luggage')->id,
                    'brand_id' => $brands->firstWhere('slug', 'gucci')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Puma Running Shoes',
                    'slug' => 'puma-running-shoes',
                    'sku' => 'PUMASHOE01',
                    'price' => 89.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'clothing')->id,
                    'brand_id' => $brands->firstWhere('slug', 'puma')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => "L'Oréal Face Cream",
                    'slug' => 'loreal-face-cream',
                    'sku' => 'LOREALCREAM01',
                    'price' => 29.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'beauty-personal-care')->id,
                    'brand_id' => $brands->firstWhere('slug', 'loreal')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Coca-Cola Pack of 12',
                    'slug' => 'coca-cola-pack-12',
                    'sku' => 'COCACOLA12',
                    'price' => 8.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'groceries')->id,
                    'brand_id' => $brands->firstWhere('slug', 'coca-cola')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Tesla Model Y',
                    'slug' => 'tesla-model-y',
                    'sku' => 'TESLAY01',
                    'price' => 49999.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'automotive')->id,
                    'brand_id' => $brands->firstWhere('slug', 'tesla')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Toyota Corolla 2023',
                    'slug' => 'toyota-corolla-2023',
                    'sku' => 'TOYCOR23',
                    'price' => 22999.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => 9,
                    'brand_id' => 12,
                    'category_id' => $categories->firstWhere('slug', 'automotive')->id,
                    'brand_id' => $brands->firstWhere('slug', 'toyota')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Chanel No. 5 Perfume',
                    'slug' => 'chanel-no-5',
                    'sku' => 'CHANEL05',
                    'price' => 129.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'beauty-personal-care')->id,
                    'brand_id' => $brands->firstWhere('slug', 'chanel')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Intel Core i9 Processor',
                    'slug' => 'intel-core-i9',
                    'sku' => 'INTELI9',
                    'price' => 499.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'electronics')->id,
                    'brand_id' => $brands->firstWhere('slug', 'intel')->id,
                    'store_id' => $store->id,
                ],
                [
                    'name' => 'Dell XPS 15',
                    'slug' => 'dell-xps-15',
                    'sku' => 'XPS15',
                    'price' => 1599.99,
                    'thumbnail' => 'https://via.placeholder.com/150',
                    'category_id' => $categories->firstWhere('slug', 'electronics')->id,
                    'brand_id' => $brands->firstWhere('slug', 'dell')->id,
                    'store_id' => $store->id,
                ],
            ];

            foreach ($products as $product) {
                Product::updateOrInsert(
                    [
                        'store_id' => $store->id,
                        'slug' => $product['slug'],
                        'sku' => $product['sku']
                    ],
                    array_merge($product, [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]),
                );
            }
        }
    }
}
