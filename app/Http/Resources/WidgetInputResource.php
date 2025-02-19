<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WidgetInputResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'label' => $this->label,
            'placeholder' => $this->placeholder ?? "",
            'value' => $this->value ?? null,
            'required' => isset($this->required) && $this->required === 0 ? false : true,
            'options' => isset($this->options) ? json_decode($this->options) : [],
            'widget_id' => $this->widget_id,
            'parent_id' => $this->parent_id,
            'type' => $this->type ? WidgetInputTypeResource::make($this->type)  : [],
            'created_at' => isset($this->created_at) ? date('d M, Y | h:i A', strtotime($this->created_at)) : "",
            'updated_at' => isset($this->updated_at) ? date('d M, Y | h:i A', strtotime($this->updated_at)) : "",
        ];
    }
}
