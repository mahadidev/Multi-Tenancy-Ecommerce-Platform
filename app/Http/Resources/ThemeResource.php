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
        $widgets = [];

        if ($this->pages) {
            $this->pages->map(function ($page) use (&$widgets) {  // Pass $widgets by reference
                $page->page_widgets->map(function ($widget) use (&$widgets) {  // Pass by reference again
                    $preparedWidget = [
                        'id' => $widget->id,
                        'name' => $widget->name,
                        'label' => $widget->label,
                        'type' => $widget->type,
                        'value' => $widget->value,
                        'thumbnail' => $widget->thumbnail ? url(Storage::url($widget->thumbnail)) : null,
                        'inputs' => json_decode($widget->inputs),
                    ];

                    // Check if there's already a widget with the same name
                    $foundWidget = current(array_filter($widgets, function ($existingWidget) use ($preparedWidget) {
                        return $existingWidget['name'] === $preparedWidget['name'];
                    }));

                    if (!$foundWidget) {
                        $widgets[] = $preparedWidget;  // Use shorthand array append
                    }
                });
            });
        }


        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail_image,
            'widgets' => $widgets,
            'pages' => $this->pages ? $this->pages->map(function ($page) {
                return [
                    'id' => $page->id,
                    'name' => $page->name,
                    'slug' => $page->slug,
                    'type' => new PageTypeResource(PageType::where(["id" => $page->type])->first()),
                    'title' => $page->title,
                    'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
                    'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
                    'widgets' => $page->page_widgets ? $page->page_widgets->map(function ($widget) {
                        return [
                            'id' => $widget->id,
                            'name' => $widget->name,
                            'label' => $widget->label,
                            'type' => $widget->type,
                            'value' => $widget->value,
                            'thumbnail' => $widget->thumbnail ? url(Storage::url($widget->thumbnail)) : null,
                            'inputs' => json_decode($widget->inputs),
                        ];
                    }) : null,
                ];
            }) : null,

        ];
    }
}
