<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Store;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ["type"=> "product", "name" => "Electronics", "slug" => "electronics"],
            ["type"=> "product", "name" => "Clothing", "slug" => "clothing"],
            ["type"=> "product", "name" => "Home & Kitchen", "slug" => "home-kitchen"],
            ["type"=> "product", "name" => "Beauty & Personal Care", "slug" => "beauty-personal-care"],
            ["type"=> "product", "name" => "Sports & Outdoors", "slug" => "sports-outdoors"],
            ["type"=> "product", "name" => "Toys & Games", "slug" => "toys-games"],
            ["type"=> "product", "name" => "Books", "slug" => "books"],
            ["type"=> "product", "name" => "Health & Wellness", "slug" => "health-wellness"],
            ["type"=> "product", "name" => "Automotive", "slug" => "automotive"],
            ["type"=> "product", "name" => "Pet Supplies", "slug" => "pet-supplies"],
            ["type"=> "product", "name" => "Baby Products", "slug" => "baby-products"],
            ["type"=> "product", "name" => "Jewelry & Watches", "slug" => "jewelry-watches"],
            ["type"=> "product", "name" => "Office Supplies", "slug" => "office-supplies"],
            ["type"=> "product", "name" => "Groceries", "slug" => "groceries"],
            ["type"=> "product", "name" => "Travel & Luggage", "slug" => "travel-luggage"],
        ];

        $store = Store::where('slug', 'goody-bro')->orWhere('domain', 'goody-bro')->first();

        if($store){
            foreach ($categories as $category) {
                Category::updateOrCreate(
                    [
                        'name' => $category['name'],
                        'slug' => $category['slug'],
                        'store_id' => $store->id,
                    ],
                    [
                        'type' => $category['type'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
       
    }
}
