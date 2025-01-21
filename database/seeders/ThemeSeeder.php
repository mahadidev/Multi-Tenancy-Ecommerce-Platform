<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemePage;
use App\Models\ThemePageWidget;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $simfy_commerce = file_get_contents("resources/js/themes/theme.json", );
        $themes = json_decode($simfy_commerce);

        foreach ($themes as $key => $theme) {
            // die(json_encode($theme));

            $newTheme = Theme::updateOrCreate([
                'name' => $theme->name,
                'slug' => $theme->slug,
            ], [
                'thumbnail' => $theme->thumbnail,
            ]);


            foreach ($theme->pages as $page) {
                $newThemePage = ThemePage::updateOrCreate(
                    [
                        'slug' => $page->slug,  // Assuming these two fields should uniquely identify a page
                        'theme_id' => $newTheme->id,
                    ],
                    [
                        'name' => $page->name,
                        'label' => $page->label,
                        'type' => $page->type,
                        'title' => $page->title,
                        'thumbnail' => $page->thumbnail,
                    ]
                );

                foreach ($page->widgets as $widget) {
                    $newThemeWidget = ThemePageWidget::updateorCreate(
                        [
                            'name' => $widget->name,
                            'theme_page_id' => $newThemePage->id,
                        ],
                        [
                            'thumbnail' => $widget->thumbnail ?? null,
                            'label' => $widget->label,
                            'inputs' => json_encode($widget->inputs),
                        ]
                    );
                }
            }

        }
    }
}
