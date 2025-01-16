<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
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
            'item' => $this->item,
            'qty' => $this->qty,
            'price' => $this->price,
            'total' => $this->total,
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'price' => $this->product->price,
                'image' => $this->product->thumbnail_image ? $this->product->thumbnail_image : 'https://placehold.co/600x400',
            ]
        ];
    }
}
