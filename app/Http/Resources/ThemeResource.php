<?php

namespace App\Http\Resources;

use App\Models\PageType;
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
        $themeWidgets = $this->widgets
            ? $this->widgets
                ->map(function ($widget) {
                    if (!$widget) {
                        return null;
                    } // Guard against null
                    return [
                        'id' => $widget->id,
                        'name' => $widget->name,
                        'label' => $widget->label,
                        'type' => $widget->type,
                        'value' => $widget->value,
                        'inputs' => json_decode($widget->inputs),
                    ];
                })
                ->filter()
            : collect([]);

        $pageWidgets = $this->pages
            ? $this->pages->flatMap(function ($page) {
                return $page->page_widgets
                    ? $page->page_widgets
                        ->map(function ($widget) {
                            if (!$widget) {
                                return null;
                            } // Guard against null
                            return [
                                'id' => $widget->id,
                                'name' => $widget->name,
                                'label' => $widget->label,
                                'type' => $widget->type,
                                'value' => $widget->value,
                                'thumbnail' => $widget->thumbnail ? url(Storage::url($widget->thumbnail)) : null,
                                'inputs' => json_decode($widget->inputs),
                            ];
                        })
                        ->filter()
                    : collect([]);
            })
            : collect([]);

        $allWidgets = $pageWidgets->concat($themeWidgets)->unique('name')->values();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail_image,
            'widgets' => $themeWidgets,
            'pages' => $this->pages
                ? $this->pages->map(function ($page) {
                    return [
                        'id' => $page->id,
                        'name' => $page->name,
                        'slug' => $page->slug,
                        'type' => $page->type ? new PageTypeResource(PageType::find($page->type)) : null,
                        'title' => $page->title,
                        'widgets' => $page->page_widgets
                            ? $page->page_widgets
                                ->map(function ($widget) {
                                    if (!$widget) {
                                        return null;
                                    } // Guard against null
                                    return [
                                        'id' => $widget->id,
                                        'name' => $widget->name,
                                        'label' => $widget->label,
                                        'type' => $widget->type,
                                        'value' => $widget->value,
                                        'thumbnail' => $widget->thumbnail ? url(Storage::url($widget->thumbnail)) : null,
                                        'inputs' => json_decode($widget->inputs),
                                    ];
                                })
                                ->filter()
                            : null,
                    ];
                })
                : null,
            'all_widgets' => $allWidgets,
        ];
    }
}
