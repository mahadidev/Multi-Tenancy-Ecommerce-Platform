<?php

namespace App\Modules\StoreManagement\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreApiCredentialResource extends JsonResource
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
            'store_id' => $this->store_id,
            'provider' => $this->provider,
            'credentials' => Crypt::decrypt($this->credentials),
            'status' => $this->status,
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at))
        ];
    }
}