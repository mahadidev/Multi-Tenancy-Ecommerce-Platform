<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StorePageWidgetInputsResource extends JsonResource
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
            'serial' => $this->serial ?? 0,
            'placeholder' => $this->placeholder ?? "",
            'value' => $this->value,
            'required' => isset($this->required) && $this->required === 0 ? false : true,
            'type' => $this->type,
            'widget_id' => $this->widget_id ?? 0,
            'items' => isset($this->items) && $this->items ? StorePageWidgetInputItemsResource::collection($this->items) : [],
            'created_at' => isset($this->created_at) ? date('d M, Y | h:i A', strtotime($this->created_at)) : "",
            'updated_at' => isset($this->updated_at) ? date('d M, Y | h:i A', strtotime($this->updated_at)) : "",
        ];
    }
}
