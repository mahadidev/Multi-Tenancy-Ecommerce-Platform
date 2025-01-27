<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $brands = [
            ["name" => "Apple", "slug" => "apple"],
            ["name" => "Samsung", "slug" => "samsung"],
            ["name" => "Nike", "slug" => "nike"],
            ["name" => "Adidas", "slug" => "adidas"],
            ["name" => "Sony", "slug" => "sony"],
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
                Brand::updateOrCreate(
                    [
                        'name' => $brand['name'],
                        'slug' => $brand['slug'],
                        'store_id' => $store->id,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
