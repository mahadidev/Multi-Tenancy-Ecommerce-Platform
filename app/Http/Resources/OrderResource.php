<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_merge(
            parent::toArray($request), // or $this->resource->toArray()
            [
                'id' => $this->id,
                'order_uuid' => $this->uuid,
                'name' => $this->name,
                'email' => $this->email,
                'phone' => $this->phone,
                'address' => $this->address,
                'user' => $this->user_id ? [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ] : null,
                'store' => [
                    'id' => $this->store->id,
                    'name' => $this->store->name,
                    'domain' => $this->store->domain,
                ],
                'total' => $this->total,
                'total_product_qty' => $this->productQty(),
                'status' => $this->status,
                'is_approved' => $this->is_approved,
                'is_payed' => $this->is_payed,
                'shipment' => $this->is_shipped ? new ShipmentResource($this->shipment) : null,
                'payment_status' => $this->payment_status,
                'payment_method' => $this->payment_method,
                'shipping_method' => $this->shipping_method,
                'shipping_cost' => $this->shipping_cost,
                'shipping_address' => $this->shipping_address,
                'billing_address' => $this->billing_address,
                'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
                'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
                'items' => OrderItemsResource::collection($this->items),
            ]
        );
    }
}
