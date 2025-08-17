<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('store_types', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('type');
            $table->timestamps();
        });

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

        foreach ($storeTypes as $item) {
            DB::table('store_types')->updateOrInsert(
                ['type' => $item['type']],
                ['label' => $item['label'], 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_types');
    }
};
