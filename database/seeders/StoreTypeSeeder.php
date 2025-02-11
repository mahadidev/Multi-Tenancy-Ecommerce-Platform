<?php

namespace Database\Seeders;

use App\Models\StoreType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storeTypes = [
            [
                'label' => 'E-Commerce',
                'type' => 'e-commerce',
            ],
            [
                'label' => 'Restaurant',
                'type' => 'restaurant',
            ],
            [
                'label' => 'Resort',
                'type' => 'resort',
            ],
            [
                'label' => 'Grocery Store',
                'type' => 'grocery-store',
            ],
            [
                'label' => 'Fashion & Apparel Store',
                'type' => 'fashion-apparel-store',
            ],
            [
                'label' => 'Electronics Store',
                'type' => 'electronics-store',
            ],
            [
                'label' => 'Pharmacy',
                'type' => 'pharmacy',
            ],
            [
                'label' => 'Furniture Store',
                'type' => 'furniture-store',
            ],
            [
                'label' => 'Bookstore',
                'type' => 'bookstore',
            ],
            [
                'label' => 'Pet Store',
                'type' => 'pet-store',
            ],
            [
                'label' => 'Bakery',
                'type' => 'bakery',
            ],
            [
                'label' => 'Gift Shop',
                'type' => 'gift-shop',
            ],
            [
                'label' => 'Repair Shop',
                'type' => 'repair-shop',
            ],
            [
                'label' => 'Tailoring Shop',
                'type' => 'tailoring-shop',
            ],
            [
                'label' => 'Tech & Gaming Store',
                'type' => 'tech-gaming-store',
            ],
            [
                'label' => 'Sustainable Product Store',
                'type' => 'sustainable-product-store',
            ],
            [
                'label' => 'Organic Food Store',
                'type' => 'organic-food-store',
            ],
            [
                'label' => 'Resort and Spa',
                'type' => 'resort-and-spa',
            ],
            [
                'label' => 'Event Venue',
                'type' => 'event-venue',
            ],
            [
                'label' => 'Food Delivery Service',
                'type' => 'food-delivery-service',
            ],
            [
                'label' => 'Travel Agency',
                'type' => 'travel-agency',
            ],
        ];
        
       foreach($storeTypes as $item){
            StoreType::updateorCreate([
                'label' => $item['label'],
                'type' => $item['type']
            ]);
       }
        
    }
}
