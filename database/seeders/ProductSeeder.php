<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'iPhone 14 Pro',
                'slug' => 'iphone-14-pro',
                'sku' => 'IPH14PRO',
                'price' => 999.99,
                'thumbnail' => 'seeder/products/iphone-14-pro.jpg',
                'category_slug' => 'electronics',
                'brand_slug' => 'apple'
            ],
            [
                'name' => 'Samsung Galaxy S23',
                'slug' => 'samsung-galaxy-s23',
                'sku' => 'GALAXYS23',
                'price' => 849.99,
                'thumbnail' => 'seeder/products/samsung-galaxy-s23.jpg',
                'category_slug' => 'electronics',
                'brand_slug' => 'samsung'
            ],
            [
                'name' => 'Nike Air Max 270',
                'slug' => 'nike-air-max-270',
                'sku' => 'NIKEAM270',
                'price' => 129.99,
                'thumbnail' => 'seeder/products/nike-air-max-270.jpg',
                'category_slug' => 'clothing',
                'brand_slug' => 'nike'
            ],
            [
                'name' => 'Adidas Ultraboost',
                'slug' => 'adidas-ultraboost',
                'sku' => 'ADIBOOST',
                'price' => 149.99,
                'thumbnail' => 'seeder/products/adidas-ultraboost.jpg',
                'category_slug' => 'clothing',
                'brand_slug' => 'adidas'
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'slug' => 'sony-wh-1000xm5',
                'sku' => 'SONYXM5',
                'price' => 299.99,
                'thumbnail' => 'seeder/products/sony-wh-1000xm5.jpg',
                'category_slug' => 'electronics',
                'brand_slug' => 'sony'
            ],
            [
                'name' => 'Microsoft Surface Pro 9',
                'slug' => 'microsoft-surface-pro-9',
                'sku' => 'SURFACEPRO9',
                'price' => 1099.99,
                'thumbnail' => 'seeder/products/microsoft-surface-pro-9.jpg',
                'category_slug' => 'electronics',
                'brand_slug' => 'microsoft'
            ],
            [
                'name' => 'Gucci Leather Bag',
                'slug' => 'gucci-leather-bag',
                'sku' => 'GUCCIBAG01',
                'price' => 1999.99,
                'thumbnail' => 'seeder/products/gucci-leather-bag.jpg',
                'category_slug' => 'travel-luggage',
                'brand_slug' => 'gucci'
            ],
            [
                'name' => 'Puma Running Shoes',
                'slug' => 'puma-running-shoes',
                'sku' => 'PUMASHOE01',
                'price' => 89.99,
                'thumbnail' => 'seeder/products/puma-running-shoes.jpg',
                'category_slug' => 'clothing',
                'brand_slug' => 'puma'
            ],
            [
                'name' => "L'Oréal Face Cream",
                'slug' => 'loreal-face-cream',
                'sku' => 'LOREALCREAM01',
                'price' => 29.99,
                'thumbnail' => 'seeder/products/loreal-face-cream.jpg',
                'category_slug' => 'beauty-personal-care',
                'brand_slug' => 'loreal'
            ],
            [
                'name' => 'Coca-Cola Pack of 12',
                'slug' => 'coca-cola-pack-12',
                'sku' => 'COCACOLA12',
                'price' => 8.99,
                'thumbnail' => 'seeder/products/coca-cola-pack-12.jpg',
                'category_slug' => 'groceries',
                'brand_slug' => 'coca-cola'
            ],
            [
                'name' => 'Tesla Model Y',
                'slug' => 'tesla-model-y',
                'sku' => 'TESLAY01',
                'price' => 49999.99,
                'thumbnail' => 'seeder/products/tesla-model-y.jpg',
                'category_slug' => 'automotive',
                'brand_slug' => 'tesla'
            ],
            [
                'name' => 'Toyota Corolla 2023',
                'slug' => 'toyota-corolla-2023',
                'sku' => 'TOYCOR23',
                'price' => 22999.99,
                'thumbnail' => 'seeder/products/toyota-corolla-2023.jpg',
                'category_slug' => 'automotive',
                'brand_slug' => 'toyota'
            ],
            [
                'name' => 'Chanel No. 5 Perfume',
                'slug' => 'chanel-no-5',
                'sku' => 'CHANEL05',
                'price' => 129.99,
                'thumbnail' => 'seeder/products/chanel-no-5.jpg',
                'category_slug' => 'beauty-personal-care',
                'brand_slug' => 'chanel'
            ],
            [
                'name' => 'Intel Core i9 Processor',
                'slug' => 'intel-core-i9',
                'sku' => 'INTELI9',
                'price' => 499.99,
                'thumbnail' => 'seeder/products/intel-core-i9.jpg',
                'category_slug' => 'electronics',
                'brand_slug' => 'intel'
            ],
            [
                'name' => 'Dell XPS 15',
                'slug' => 'dell-xps-15',
                'sku' => 'XPS15',
                'price' => 1599.99,
                'thumbnail' => 'seeder/products/dell-xps-15.jpg',
                'category_slug' => 'electronics',
                'brand_slug' => 'dell'
            ],
        ];

        $store = Store::with('brands', 'categories')->where('slug', 'goody-bro')->orWhere('domain', 'goody-bro')->first();

        if ($store) {
            foreach ($products as $product) {
                $category = $store->categories->firstWhere('slug', $product['category_slug']);
                $brand = $store->brands->firstWhere('slug', $product['brand_slug']);

                if ($category && $brand) {
                    Product::updateOrCreate(
                        [
                            'store_id' => $store->id,
                            'slug' => $product['slug'],
                            'sku' => $product['sku']
                        ],
                        [
                            'name' => $product['name'],
                            'price' => $product['price'],
                            'thumbnail' => $product['thumbnail'],
                            'category_id' => $category->id,
                            'brand_id' => $brand->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        }
    }
}