<?php

namespace Database\Seeders;

use App\Http\Resources\ThemeResource;
use App\Models\User;
use App\Models\Store;
use App\Models\StorePage;
use App\Models\StorePageWidget;
use App\Models\StorePageWidgetInput;
use App\Models\StorePageWidgetInputItem;
use App\Models\Theme;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class SellerAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure the 'store-owner' role exists
        $role = Role::firstOrCreate(['name' => 'seller']);

        // Find the user by email or create a new one
        $user = User::updateOrCreate(
            ['email' => 'team@chologori.com'], // Search criteria
            [
                // Data to update or create
                'name' => 'Chologori-Team',
                'password' => Hash::make('123'), // Default password
            ],
        );

        // Assign the 'store-owner' role to the user
        if (!$user->hasRole($role->name)) {
            $user->assignRole($role);
        }

        $store = Store::updateOrCreate(
            [
                'owner_id' => $user->id, // Search criteria
                'domain' => 'goody-bro', // Search criteria
            ],
            [
                // Data to update or create
                'slug' => 'goody-bro',
                'primary_color' => "#ffc100",
                'secondary_color' => "#fbcfe8",
                'logo' => "seeders/stores/goddybro-logo.png",
                'name' => 'Goody Bro',
                'currency' => 'BDT',
                'status' => 1,
            ]
        );

        $theme = Theme::with('pages.page_widgets')->with("widgets")->first();
        $themeData = new \App\Http\Resources\ThemeResource($theme);

        if ($theme) {
            $store->update(['theme_id' => $theme->id]);
            $pages = $themeData->pages;

            if ($pages) {
                foreach ($pages as $page) {
                    if (isset($page)) {
                        $storePage = StorePage::updateOrCreate(
                            [
                                'store_id' => $store->id,
                                'name' => $page['name'],
                            ],
                            [
                                'type' => $page['type'],
                                'slug' => $page['slug'],
                                'title' => $page['title'],
                                'is_active' => true,
                            ],
                        );

                        if (isset($page['page_widgets'])) {
                            foreach ($page['page_widgets'] as $key => $widget) {
                                $storePageWidget = StorePageWidget::updateOrCreate(
                                    [
                                        'store_page_id' => $storePage->id,
                                        'name' => $widget['name'],
                                    ],
                                    [
                                        'label' => $widget['label'] ?? null,
                                        'serial' => $key + 1,
                                    ]
                                );

                                if (isset($widget['inputs'])) {
                                    foreach (json_decode($widget['inputs']) as $inputKey => $input) {
                                        $storePageWidgetInput = StorePageWidgetInput::updateOrCreate(
                                            [
                                                'widget_id' => $storePageWidget->id,
                                                'name' => $input->name,
                                            ],
                                            [
                                                'label' => $input->label ?? null,
                                                'placeholder' => $input->placeholder ?? null,
                                                'value' => $input->value ?? null,
                                                'required' => $input->required ?? false,
                                                'type' => $input->type ?? null,
                                            ]
                                        );

                                        if (isset($input->items)) {
                                            foreach ($input->items as $itemKey => $item) {
                                                $storePageWidgetInputItems = StorePageWidgetInputItem::updateOrCreate(
                                                    [
                                                        'widget_input_id' => $storePageWidgetInput->id,
                                                        'name' => $item->name,
                                                    ],
                                                    [
                                                        'label' => $item->label ?? null,
                                                        'placeholder' => $item->placeholder ?? null,
                                                        'value' => $item->value ?? null,
                                                        'required' => $item->required ?? false,
                                                        'type' => $item->type ?? null,
                                                    ]
                                                );
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
