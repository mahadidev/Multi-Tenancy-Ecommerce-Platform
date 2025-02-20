<?php

namespace Database\Seeders;

use App\Models\PageType;
use App\Models\Theme;
use App\Models\ThemePage;
use App\Models\ThemePageWidget;
use App\Models\ThemeWidget;
use App\Models\Widget;
use App\Models\WidgetInput;
use App\Models\WidgetType;
use App\Models\WidgetInputType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $simfy_commerce = file_get_contents('resources/js/themes/themesSeeder-test.json');
        $themes = json_decode($simfy_commerce);

        foreach ($themes as $key => $theme) {
            $newTheme = Theme::updateOrCreate(
                [
                    'name' => $theme->name,
                    'slug' => $theme->slug,
                ],
                [
                    'thumbnail' => $theme->thumbnail ?? null,
                ],
            );

            if (isset($theme->widgets)) {
                foreach ($theme->widgets as $widget) {
                    // widget type if exist or create
                    if (WidgetType::where(['type' => $widget->type])->first()) {
                        $widget->type_id = WidgetType::where(['type' => $widget->type])->first()->id;
                    } else {
                        $createdWidgetType = WidgetType::create([
                            'type' => $widget->type,
                            'label' => strtoupper($widget->type),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        $widget->type_id = $createdWidgetType->id;
                    }

                    $widgetData = Widget::updateorCreate(
                        [
                            'name' => $widget->name,
                            'ref_id' => $newTheme->id,
                            'ref_type' => Theme::class,
                        ],
                        [
                            'name' => $widget->name,
                            'label' => $widget->label,
                            'type_id' => $widget->type_id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                    );

                    if ($widget->inputs) {
                        foreach ($widget->inputs as $input) {
                            $themeWidgetInput = WidgetInput::updateorCreate(
                                [
                                    'name' => $input->name,
                                    'widget_id' => $widgetData->id,
                                ],
                                [
                                    'label' => $input->label,
                                    'placeholder' => $input->placeholder ?? null,
                                    'value' => $input->value ?? null,
                                    'options' => isset($input->options) ? json_encode($input->options) : null,
                                    'required' => $input->required ?? false,
                                    'type_id' =>
                                        WidgetInputType::where(['value' => $input->type])
                                            ->orwhere(['label' => $input->type])
                                            ->orwhere(['id' => $input->type])
                                            ->first()->id ?? 1,
                                    'parent_id' => $input->parent_id ?? null,
                                ],
                            );

                            if ($input->child) {
                                $themeWidgetChildInput = WidgetInput::updateorCreate([
                                    'widget_id' => $widgetData->id,
                                    'name' => $input->name,
                                ],[
                                    'label' => $input->label,
                                    'placeholder' => $input->placeholder ?? null,
                                    'value' => $input->value ?? null,
                                    'options' => isset($input->options) ? json_encode($input->options) : null,
                                    'required' => $input->required ?? false,
                                    'type_id' =>
                                        WidgetInputType::where(['value' => $input->type])
                                            ->orwhere(['label' => $input->type])
                                            ->orwhere(['id' => $input->type])
                                            ->first()->id ?? 1,
                                    'parent_id' => $themeWidgetInput->id,
                                ]);
                            }
                        }
                    }
                }
            }

            if (isset($theme->pages)) {
                foreach ($theme->pages as $page) {
                    // check page type exist else create
                    if (PageType::where(['type' => $page->type])->first()) {
                        $page->type = PageType::where(['type' => $page->type])->first()->id;
                    } else {
                        $createdPageType = PageType::create(['type' => $page->type, 'label' => strtoupper($page->type)]);

                        $page->type = $createdPageType->id;
                    }

                    // NEED TO FIX while npm run build setup
                    // $page->layout_id = $page->layout_id ?? null;
                    // if(isset($page->layout)){
                    //     // check type exist else create

                    //     if (Widget::where([
                    //         "ref_id" => $theme->id,
                    //         "ref_type" => ThemePage::class,
                    //         "name" => $page->layout->name
                    //         ])->first()) {

                    //         $page->layout_id = Widget::where(["ref_type" =>ThemePage::class, "ref_id" => $theme->id, "name" => $page->layout->name])->first()->id;
                    //     } else {
                    //         $firstLayout = Widget::where(["theme_id" => $theme->id])->first()->id ?? null;

                    //         $page->layout_id = $firstLayout->id;
                    //     }
                    // }

                    $newThemePage = ThemePage::updateOrCreate(
                        [
                            'slug' => $page->slug, // Assuming these two fields should uniquely identify a page
                            'theme_id' => $newTheme->id,
                            // "layout_id" => $page->layout_id
                        ],
                        [
                            'name' => $page->name,
                            'label' => $page->label,
                            'type' => $page->type,
                            'title' => $page->title,
                            'thumbnail' => $page->thumbnail,
                        ],
                    );

                    if ($page->widgets) {
                        foreach ($page->widgets as $widget) {

                            // widget type if exist or create
                            if (WidgetType::where(['type' => $widget->type])->first()) {
                                $widget->type_id = WidgetType::where(['type' => $widget->type])->first()->id;
                            } else {
                                $createdWidgetType = WidgetType::create([
                                    'type' => $widget->type,
                                    'label' => strtoupper($widget->type),
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ]);

                                $widget->type_id = $createdWidgetType->id;
                            }

                            $widgetData = Widget::updateorCreate(
                                [
                                    'name' => $widget->name,
                                    'ref_id' => $newThemePage->id,
                                    'ref_type' => ThemePage::class,
                                ],
                                [
                                    'name' => $widget->name,
                                    'label' => $widget->label,
                                    'type_id' => $widget->type_id,
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ],
                            );

                            if ($widget->inputs) {
                                foreach ($widget->inputs as $input) {
                                    $themeWidgetInput = WidgetInput::updateorCreate(
                                        [
                                            'name' => $input->name,
                                            'widget_id' => $widgetData->id,
                                        ],
                                        [
                                            'label' => $input->label,
                                            'placeholder' => $input->placeholder ?? null,
                                            'value' => $input->value ?? null,
                                            'options' => isset($input->options) ? json_encode($input->options) : null,
                                            'required' => $input->required ?? false,
                                            'type_id' =>
                                                WidgetInputType::where(['value' => $input->type])
                                                    ->orwhere(['label' => $input->type])
                                                    ->orwhere(['id' => $input->type])
                                                    ->first()->id ?? 1,
                                            'parent_id' => $input->parent_id ?? null,
                                        ],
                                    );

                                    if ($input->child) {
                                        $themeWidgetChildInput = WidgetInput::updateorCreate([
                                            'widget_id' => $widgetData->id,
                                            'name' => $input->name,
                                        ],[
                                            'label' => $input->label,
                                            'placeholder' => $input->placeholder ?? null,
                                            'value' => $input->value ?? null,
                                            'options' => isset($input->options) ? json_encode($input->options) : null,
                                            'required' => $input->required ?? false,
                                            'type_id' =>
                                                WidgetInputType::where(['value' => $input->type])
                                                    ->orwhere(['label' => $input->type])
                                                    ->orwhere(['id' => $input->type])
                                                    ->first()->id ?? 1,
                                            'parent_id' => $themeWidgetInput->id,
                                        ]);
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
