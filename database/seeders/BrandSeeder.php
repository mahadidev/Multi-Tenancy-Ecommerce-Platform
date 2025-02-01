<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $brands = [
            ["name" => "Apple", "slug" => "apple", "image" => 'images/brands/apple.jpg'],
            ["name" => "Samsung", "slug" => "samsung", "image" => 'images/brands/samsung.jpg'],
            ["name" => "Nike", "slug" => "nike", "image" => 'images/brands/nike.jpg'],
            ["name" => "Adidas", "slug" => "adidas", "image" => 'images/brands/adidas.jpg'],
            ["name" => "Sony", "slug" => "sony", "image" => 'images/brands/sony.jpg'],
            ["name" => "Microsoft", "slug" => "microsoft"],
            ["name" => "Gucci", "slug" => "gucci"],
            ["name" => "Puma", "slug" => "puma"],
            ["name" => "L'Oréal", "slug" => "loreal"],
            ["name" => "Coca-Cola", "slug" => "coca-cola"],
            ["name" => "Tesla", "slug" => "tesla"],
            ["name" => "Toyota", "slug" => "toyota"],
            ["name" => "Chanel", "slug" => "chanel"],
            ["name" => "Intel", "slug" => "intel"],
            ["name" => "Dell", "slug" => "dell"],
        ];

        $store = Store::where('slug', 'goody-bro')->orWhere('domain', 'goody-bro')->first();

        if($store){
            foreach ($brands as $brand) {

                $imagePath = isset($brand['image']) ? asset($brand['image']) : null;

                Brand::updateOrCreate(
                    [
                        'name' => $brand['name'],
                        'slug' => $brand['slug'],
                        'store_id' => $store->id,
                    ],
                    [
                        'image' => $imagePath ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
