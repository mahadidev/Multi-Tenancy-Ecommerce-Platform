<?php

namespace App\Modules\StoreManagement\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShipmentResource extends JsonResource
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
            'invoice' => $this->invoice,
            'recipient_name' => $this->recipient_name,
            'recipient_phone' => $this->recipient_phone,
            'recipient_address' => $this->recipient_address,
            'cod_amount' => $this->cod_amount,
            'note' => $this->note,
            'consignment_id' => $this->consignment_id,
            'tracking_code' => $this->tracking_code,
            'status' => $this->status,
            'order_id' => $this->order_id,
            'store_id' => $this->store_id,
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
