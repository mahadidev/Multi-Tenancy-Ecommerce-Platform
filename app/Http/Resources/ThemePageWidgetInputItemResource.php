<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThemePageWidgetInputItemResource extends JsonResource
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
            'value' => $this->value,
            'required' => isset($this->required) && $this->required === 0 ? false : true,
            'type' => $this->type,
        ];
    }
}
