<?php

namespace App\Http\Resources;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThemeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        // Collecting widgets from $this->widgets
        $themeWidgets = $this->widgets->map(function ($widget) {
            return [
                'id' => $widget->id,
                'name' => $widget->name,
                'label' => $widget->label,
                'type' => $widget->type,
                'value' => $widget->value,
                'inputs' => json_decode($widget->inputs),
            ];
        });

        // Collecting all widgets from pages
        $pageWidgets = $this->pages->flatMap(function ($page) {
            return $page->page_widgets->map(function ($widget) {
                return [
                    'id' => $widget->id,
                    'name' => $widget->name,
                    'label' => $widget->label,
                    'type' => $widget->type,
                    'value' => $widget->value,
                    'thumbnail' => url(Storage::url($widget->thumbnail)),
                    'inputs' => json_decode($widget->inputs),
                ];
            });
        });

        // Merging both collections and ensuring uniqueness by widget name
        $allWidgets = $pageWidgets
            ->concat($themeWidgets)
            ->unique('name')
            ->values(); // Resetting keys for a clean array

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail_image,
            'widgets' => $themeWidgets,
            'pages' => $this->pages->map(function ($page) {
                return [
                    'id' => $page->id,
                    'name' => $page->name,
                    'slug' => $page->slug,
                    'type' => $page->type,
                    'title' => $page->title,
                    'widgets' => $page->page_widgets->map(function ($widget) {
                        return [
                            'id' => $widget->id,
                            'name' => $widget->name,
                            'label' => $widget->label,
                            'type' => $widget->type,
                            'value' => $widget->value,
                            'thumbnail' => url(Storage::url($widget->thumbnail)),
                            'inputs' => json_decode($widget->inputs),
                        ];
                    }),
                ];
            }),
            'all_widgets' => $allWidgets,
        ];
    }
}
