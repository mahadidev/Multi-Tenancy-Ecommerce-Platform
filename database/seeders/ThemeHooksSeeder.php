<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ThemeHooksSeeder extends Seeder
{
    public function run()
    {
        $hooks = [
            // Commerce hooks
            [
                'name' => 'add-to-cart',
                'type' => 'action',
                'category' => 'commerce',
                'description' => 'Triggered when a product is added to cart',
                'parameters' => json_encode([
                    'product_id' => ['type' => 'integer', 'required' => true],
                    'quantity' => ['type' => 'integer', 'required' => true, 'default' => 1],
                    'variant_id' => ['type' => 'integer', 'required' => false]
                ]),
                'response_schema' => json_encode([
                    'success' => 'boolean',
                    'cart_id' => 'string',
                    'item_id' => 'string',
                    'cart_count' => 'integer'
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'remove-from-cart',
                'type' => 'action',
                'category' => 'commerce',
                'description' => 'Triggered when a product is removed from cart',
                'parameters' => json_encode([
                    'item_id' => ['type' => 'string', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'update-cart',
                'type' => 'action',
                'category' => 'commerce',
                'description' => 'Triggered when cart is updated',
                'parameters' => json_encode([
                    'item_id' => ['type' => 'string', 'required' => true],
                    'quantity' => ['type' => 'integer', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'get-cart',
                'type' => 'action',
                'category' => 'commerce',
                'description' => 'Get user cart items',
                'parameters' => json_encode([]),
                'response_schema' => json_encode([
                    'success' => 'boolean',
                    'cart' => [
                        'items' => 'array',
                        'total' => 'number',
                        'count' => 'integer'
                    ]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'checkout',
                'type' => 'action',
                'category' => 'commerce',
                'description' => 'Triggered when checkout is initiated',
                'parameters' => json_encode([
                    'cart_id' => ['type' => 'string', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'create-order',
                'type' => 'action',
                'category' => 'commerce',
                'description' => 'Triggered when an order is created',
                'parameters' => json_encode([
                    'cart_id' => ['type' => 'string', 'required' => true],
                    'payment_method' => ['type' => 'string', 'required' => true],
                    'shipping_address' => ['type' => 'object', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            
            // Auth hooks
            [
                'name' => 'user-login',
                'type' => 'action',
                'category' => 'auth',
                'description' => 'Triggered when a user logs in',
                'parameters' => json_encode([
                    'email' => ['type' => 'string', 'required' => true],
                    'password' => ['type' => 'string', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'user-signup',
                'type' => 'action',
                'category' => 'auth',
                'description' => 'Triggered when a user signs up',
                'parameters' => json_encode([
                    'name' => ['type' => 'string', 'required' => true],
                    'email' => ['type' => 'string', 'required' => true],
                    'password' => ['type' => 'string', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'user-logout',
                'type' => 'action',
                'category' => 'auth',
                'description' => 'Triggered when a user logs out',
                'parameters' => json_encode([]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'reset-password',
                'type' => 'action',
                'category' => 'auth',
                'description' => 'Triggered when password reset is requested',
                'parameters' => json_encode([
                    'email' => ['type' => 'string', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            
            // Product hooks
            [
                'name' => 'add-review',
                'type' => 'action',
                'category' => 'product',
                'description' => 'Triggered when a product review is added',
                'parameters' => json_encode([
                    'product_id' => ['type' => 'integer', 'required' => true],
                    'rating' => ['type' => 'integer', 'required' => true],
                    'comment' => ['type' => 'string', 'required' => false]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'add-to-wishlist',
                'type' => 'action',
                'category' => 'product',
                'description' => 'Triggered when a product is added to wishlist',
                'parameters' => json_encode([
                    'product_id' => ['type' => 'integer', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'product-inquiry',
                'type' => 'action',
                'category' => 'product',
                'description' => 'Triggered when a product inquiry is submitted',
                'parameters' => json_encode([
                    'product_id' => ['type' => 'integer', 'required' => true],
                    'message' => ['type' => 'string', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            
            // Filter hooks
            [
                'name' => 'product-price',
                'type' => 'filter',
                'category' => 'product',
                'description' => 'Filters product price display',
                'parameters' => json_encode([
                    'value' => ['type' => 'number', 'required' => true],
                    'product_id' => ['type' => 'integer', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'shipping-methods',
                'type' => 'filter',
                'category' => 'commerce',
                'description' => 'Filters available shipping methods',
                'parameters' => json_encode([
                    'value' => ['type' => 'array', 'required' => true],
                    'address' => ['type' => 'object', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ],
            [
                'name' => 'payment-methods',
                'type' => 'filter',
                'category' => 'commerce',
                'description' => 'Filters available payment methods',
                'parameters' => json_encode([
                    'value' => ['type' => 'array', 'required' => true]
                ]),
                'is_core' => true,
                'is_active' => true
            ]
        ];

        foreach ($hooks as $hook) {
            DB::table('theme_hooks')->updateOrInsert(
                ['name' => $hook['name']],
                array_merge($hook, [
                    'created_at' => now(),
                    'updated_at' => now()
                ])
            );
        }
    }
}