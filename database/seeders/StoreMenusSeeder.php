<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\StoreMenu;
use App\Models\StoreMenuItem;

class StoreMenusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            [
                "name" => "main",
                "label" => "Main Menu",
                "visibility" => "all",
                "items" => [
                    [
                        "label" => "Home",
                        "href" => "/"
                    ],
                    [
                        "label" => "About",
                        "href" => "/about"
                    ]
                ]
            ],
            [
                "name" => "guest",
                "label" => "Guest Menu",
                "visibility" => "guest",
                "items" => [
                    [
                        "label" => "Login",
                        "href" => "/login"
                    ],
                    [
                        "label" => "Sing Up",
                        "href" => "singup"
                    ]
                ]
            ],
            [
                "name" => "user",
                "label" => "User Menu",
                "visibility" => "user",
                "items" => [
                    [
                        "label" => "My Account",
                        "href" => "/my-acocunt"
                    ]
                ]
            ]
        ];

        $store = Store::where('slug', 'goody-bro')->orWhere('domain', 'goody-bro')->first();
        if ($store) {
            foreach ($menus as $menuData) {
                // Update or create the menu
                $menu = StoreMenu::updateOrCreate(
                    [
                        'store_id' => $store->id,
                        'name' => $menuData['name'], // Unique identifier for the menu
                    ],
                    [
                        'label' => $menuData['label'],
                        'visibility' => $menuData['visibility'],
                    ]
                );

                // Update or create menu items
                if (isset($menuData['items'])) {
                    foreach ($menuData['items'] as $itemData) {
                        StoreMenuItem::updateOrCreate(
                            [
                                'store_menu_id' => $menu->id,
                                'label' => $itemData['label'], // Unique identifier for the item
                            ],
                            [
                                'href' => $itemData['href'],
                            ]
                        );
                    }
                }
            }
        }
    }
}
