<?php

namespace App\Http\Resources;

use App\Models\ThemePageWidget;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThemeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)//: array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail_image,
            'widgets' => $this->widgets,
            // 'pages-old' => $this->pages,
            'pages' => $this->pages->map(function ($page) {
                return [
                    'id' => $page->id,
                    'name' => $page->name,
                    'slug' => $page->slug,
                    'title' => $page->title,
                    'widgets' => $page->page_widgets->map(function ($widget) {
                        return [
                            'id' => $widget->id,
                            'name' => $widget->name,
                            'label' => $widget->label,
                            'type' => $widget->type,
                            'value' => $widget->value,
                            'inputs' => json_decode($widget->inputs),
                        ];
                    }),
                ];
            }),
        ];
    }
   
}
