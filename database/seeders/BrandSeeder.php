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
            ["name" => "Apple", "slug" => "apple", "image" => 'seeder/brands/apple.jpg'],
            ["name" => "Samsung", "slug" => "samsung", "image" => 'seeder/brands/samsung.jpg'],
            ["name" => "Nike", "slug" => "nike", "image" => 'seeder/brands/nike.jpg'],
            ["name" => "Adidas", "slug" => "adidas", "image" => 'seeder/brands/adidas.jpg'],
            ["name" => "Sony", "slug" => "sony", "image" => 'seeder/brands/sony.jpg'],
            ["name" => "Microsoft", "slug" => "microsoft", "image" => 'seeder/brands/microsoft.jpg'],
            ["name" => "Gucci", "slug" => "gucci", "image" => 'seeder/brands/gucci.jpg'],
            ["name" => "Puma", "slug" => "puma", "image" => 'seeder/brands/puma.jpg'],
            ["name" => "L'Oréal", "slug" => "loreal", "image" => 'seeder/brands/loreal.jpg'],
            ["name" => "Coca-Cola", "slug" => "coca-cola", "image" => 'seeder/brands/coca-cola.jpg'],
            ["name" => "Tesla", "slug" => "tesla", "image" => 'seeder/brands/tesla.jpg'],
            ["name" => "Toyota", "slug" => "toyota", "image" => 'seeder/brands/toyota.jpg'],
            ["name" => "Chanel", "slug" => "chanel", "image" => 'seeder/brands/chanel.jpg'],
            ["name" => "Intel", "slug" => "intel", "image" => 'seeder/brands/intel.jpg'],
            ["name" => "Dell", "slug" => "dell", "image" => 'seeder/brands/dell.jpg'],
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
