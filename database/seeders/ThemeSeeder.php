<?php

namespace Database\Seeders;

use App\Models\PageType;
use App\Models\Theme;
use App\Models\ThemePage;
use App\Models\ThemePageWidget;
use App\Models\ThemeWidget;
use App\Models\WidgetType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $simfy_commerce = file_get_contents("resources/js/themes/themesSeeder.json", );
        $themes = json_decode($simfy_commerce);

        foreach ($themes as $key => $theme) {
            // die(json_encode($theme));

            $newTheme = Theme::updateOrCreate([
                'name' => $theme->name,
                'slug' => $theme->slug,
            ], [
                'thumbnail' => $theme->thumbnail,
            ]);

            foreach ($theme->widgets as $widget){
                // widget type if exist or create
                if (WidgetType::where(["type" => $widget->type])->first()) {
                    $widget->widget_type_id = WidgetType::where(["type" => $widget->type])->first()->id;
                } else {
                    $createdWidgetType = WidgetType::create(["type" => $widget->type, "label" => strtoupper($widget->type)]);

                    $widget->widget_type_id = 1;
                }

                ThemeWidget::updateorCreate(
                    [
                        'name' => $widget->name,
                        'theme_id' => $theme->id,
                    ],
                    [
                        'thumbnail' => $widget->thumbnail ?? null,
                        'label' => $widget->label,
                        'widget_type_id' => $widget->widget_type_id,
                        'inputs' => json_encode($widget->inputs),
                    ]
                );
            }

            foreach ($theme->pages as $page) {
                // check type exist else create
                if(PageType::where(["type" => $page->type])->first()){
                    $page->type = PageType::where(["type" => $page->type])->first()->id;
                }else{
                    $createdPageType = PageType::create(["type" => $page->type, "label" => strtoupper($page->type)]);

                    $page->type = $createdPageType->id;
                }

                $newThemePage = ThemePage::updateOrCreate(
                    [
                        'slug' => $page->slug,  // Assuming these two fields should uniquely identify a page
                        'theme_id' => $newTheme->id,
                        'layout_id' => $page->layout_id,
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
                    // widget type if exist or create
                    if(WidgetType::where(["type" => $widget->type])->first()){
                        $widget->widget_type_id = WidgetType::where(["type" => $widget->type])->first()->id;
                    }else{
                        $createdWidgetType = WidgetType::create(["type" => $widget->type, "label" => strtoupper($widget->type)]);

                        $widget->widget_type_id = $createdWidgetType->id;
                    }

                    ThemePageWidget::updateorCreate(
                        [
                            'name' => $widget->name,
                            'theme_page_id' => $newThemePage->id,
                        ],
                        [
                            'thumbnail' => $widget->thumbnail ?? null,
                            'label' => $widget->label,
                            'widget_type_id' => $widget->widget_type_id,
                            'inputs' => json_encode($widget->inputs),
                        ]
                    );
                }
            }

        }
    }
}
