<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\WidgetGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $themes = [
            [
                'name' => 'Default',
                'slug' => 'default',
                'thumbnail' => null,
                'is_active' => 1
            ],
            [
                'name' => 'Astra',
                'slug' => 'astra',
                'thumbnail' => null,
                'is_active' => 1
            ],
           
        ];

        $themesExistingCount = Theme::get()->count();

        if ($themesExistingCount == 0) {
            foreach($themes as $key => $group){
                $theme = Theme::firstOrCreate(
                    ['slug' => $group['slug']],
                    [
                        'name' => $group['name'],
                        'is_active' => $group['is_active'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
    
                // add widget groups to the theme in pivot table theme_widget_group
                $widgets = WidgetGroup::get()->pluck('id');
    
                if($widgets){
                    $theme->widgetGroups()->sync($widgets);
                }
            }
        }
       
    }
}
