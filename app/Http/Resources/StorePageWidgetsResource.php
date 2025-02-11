<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StorePageWidgetsResource extends JsonResource
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
            'store_page_id' => $this->store_page_id,
            'name' => $this->name,
            'label' => $this->label,
            'serial' => $this->serial ?? 0,
            'is_editable' => $this->is_editable === 1 ? true : false,
            'type' => $this->widgetType ?? null,
            'inputs' => $this->widgetInputs ? StorePageWidgetInputsResource::collection($this->widgetInputs) : [],
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
