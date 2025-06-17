<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemsResource extends JsonResource
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
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'qty' => $this->qty,
            'price' => $this->price,
            'total' => $this->total,
            'discount' => $this->discount,
            'discount_amount' => $this->discount_amount,
            'taxAmount' => $this->taxAmount,
            'afterTaxTotalPrice' => $this->afterTaxTotalPrice,
            'product' => $this->product,
        ];
    }
}
