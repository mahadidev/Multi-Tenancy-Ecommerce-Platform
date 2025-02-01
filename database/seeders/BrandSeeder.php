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
            ["name" => "Apple", "slug" => "apple", "image" => 'seeders/brands/apple.jpg'],
            ["name" => "Samsung", "slug" => "samsung", "image" => 'seeders/brands/samsung.jpg'],
            ["name" => "Nike", "slug" => "nike", "image" => 'seeders/brands/nike.jpg'],
            ["name" => "Adidas", "slug" => "adidas", "image" => 'seeders/brands/adidas.jpg'],
            ["name" => "Sony", "slug" => "sony", "image" => 'seeders/brands/sony.jpg'],
            ["name" => "Microsoft", "slug" => "microsoft", "image" => 'seeders/brands/microsoft.jpg'],
            ["name" => "Gucci", "slug" => "gucci", "image" => 'seeders/brands/gucci.jpg'],
            ["name" => "Puma", "slug" => "puma", "image" => 'seeders/brands/puma.jpg'],
            ["name" => "L'Oréal", "slug" => "loreal", "image" => 'seeders/brands/loreal.jpg'],
            ["name" => "Coca-Cola", "slug" => "coca-cola", "image" => 'seeders/brands/coca-cola.jpg'],
            ["name" => "Tesla", "slug" => "tesla", "image" => 'seeders/brands/tesla.jpg'],
            ["name" => "Toyota", "slug" => "toyota", "image" => 'seeders/brands/toyota.jpg'],
            ["name" => "Chanel", "slug" => "chanel", "image" => 'seeders/brands/chanel.jpg'],
            ["name" => "Intel", "slug" => "intel", "image" => 'seeders/brands/intel.jpg'],
            ["name" => "Dell", "slug" => "dell", "image" => 'seeders/brands/dell.jpg'],
        ];

        $store = Store::where('slug', 'goody-bro')->orWhere('domain', 'goody-bro')->first();

        if($store){
            foreach ($brands as $brand) {

                $imagePath = isset($brand['image']) ? $brand['image'] : null;

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
