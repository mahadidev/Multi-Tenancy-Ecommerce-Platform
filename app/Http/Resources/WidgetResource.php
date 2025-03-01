<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WidgetResource extends JsonResource
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
            'ref_id' => $this->ref_id, // Morph reference ID
            'ref_type' => $this->ref_type, // Morph reference type
            'type_id' => $this->type_id,
            'name' => $this->name,
            'label' => $this->label,
            'serial' => $this->serial ?? 0,
            'type' => $this->type ? new WidgetTypeResource($this->type) : [], // Related widget type
            'inputs' => $this->widgetInputs ? WidgetInputResource::collection($this->widgetInputs) : [], // Related widget inputs
            'created_at' => $this->created_at->format('d M, Y | h:i A'),
            'updated_at' => $this->updated_at->format('d M, Y | h:i A'),
        ];
    }
}
