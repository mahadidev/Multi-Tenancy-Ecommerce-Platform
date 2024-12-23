<?php

namespace Database\Seeders;

use App\Models\Widget;
use App\Models\WidgetGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class WidgetSeeder extends Seeder
{
    public function run()
    {
        // Define widget groups and their properties
        $widgetGroups = [
            [
                'group_name' => 'footer',
                'group_label' => 'Footer Widgets',
                'location' => 'botton',
                'widgets' => [
                    [
                        'meta_name' => 'site_details',
                        'meta_title' => 'Site Details',
                        'meta_value' => 'Your eCommerce site description goes here.',
                        'field_type' => 'textarea',
                        'sorting' => 1,
                        'settings' => [],
                    ],
                    [
                        'meta_name' => 'contact',
                        'meta_title' => 'Contact Us',
                        'meta_value' => 'content',
                        'field_type' => 'text',
                        'sorting' => 2,
                        'settings' => [
                            'email' => 'example@gmail.com',
                            'phone' => '017********',
                            'address' => 'Dhaka, Bangladesh',
                            'address-2' => 'Dhaka, Bangladesh',
                        ],
                    ],
                    [
                        'meta_name' => 'get_to_know_us',
                        'meta_title' => 'Get to Know Us',
                        'meta_value' => 'content',
                        'field_type' => 'text',
                        'sorting' => 3,
                        'settings' => [
                            'About Us' => 'https://example.com/about',
                            'Contact' => 'https://example.com/contact',
                            'FAQ' => 'https://example.com/faq',
                            'Return Policy' => 'https://example.com/return-policy',
                        ],
                    ],
                    [
                        'meta_name' => 'our_policy',
                        'meta_title' => 'Our Policy',
                        'meta_value' => 'content',
                        'field_type' => 'text',
                        'sorting' => 4,
                        'settings' => [
                            'Terms & Conditions' => 'https://example.com/terms-conditions',
                            'Privacy Policy' => 'https://example.com/privacy-policy',
                        ],
                    ],
                ]
            ],
            [
                'group_name' => 'header',
                'group_label' => 'Header Widgets',
                'location' => 'top',
                'widgets' =>  [
                    [
                        'meta_name' => 'top_navbar',
                        'meta_title' => 'Top Navbar Menu',
                        'meta_value' => 'content',
                        'field_type' => 'text',
                        'sorting' => 1,
                        'settings' => [
                            'Home' => env('APP_URL'),
                            'Shop' => env('APP_URL').'/shop',
                            'Store' => env('APP_URL').'/store',
                        ],
                    ],
                    [
                        'meta_name' => 'canvas_navbar',
                        'meta_title' => 'Canvas Navbar Menu',
                        'meta_value' => 'content',
                        'field_type' => 'text',
                        'sorting' => 1,
                        'settings' => [
                            'Home' => env('APP_URL'),
                            'Shop' => env('APP_URL').'/shop',
                            'Store' => env('APP_URL').'/store',
                        ],
                    ],
                   
                ],
            ],
            [
                'group_name' => 'most_trending_product',
                'group_label' => 'Most Trending Product',
                'location' => 'left',
                'widgets' =>  [
                    [
                        'meta_name' => 'most_trending_product',
                        'meta_title' => 'Most Trending Product',
                        'meta_value' => '01JAYSXE095V0YTPB8YY2WJ50C.jpg',
                        'field_type' => 'image',
                        'sorting' => 1,
                        'settings' => [
                            'title' => '100% Organic Coffee Beans.',
                            'description' => 'Get the best deal before close.',
                            'button-status' => 'on',
                            'button-label' => 'Shop now',
                            'button-url' => '#',
                        ],
                    ],
                   
                ],
            ],
        ];


        // Seeding the data from the array
        foreach ($widgetGroups as $group) {
            $createdGroup = WidgetGroup::firstOrCreate(
                ['group_name' => $group['group_name']],
                [
                    'group_label' => $group['group_label'],
                    'location' => $group['location'],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]
            );

            // Ensure 'widgets' key exists before looping through it
            if (isset($group['widgets'])) {
                foreach ($group['widgets'] as $widget) {
                    $createdWidget = Widget::firstOrCreate(
                        [
                            'meta_name' => $widget['meta_name'],  // Access the widget's meta_name
                            'group_id' => $createdGroup->id,
                        ],
                        [
                            'meta_title' => $widget['meta_title'],  // Access other widget properties
                            'meta_value' => $widget['meta_value'],
                            'field_type' => $widget['field_type'],
                            'sorting' => $widget['sorting'],
                            'settings' => $widget['settings'],
                            'is_active' => 1,
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]
                    );
                }
            }
        }

    }
}