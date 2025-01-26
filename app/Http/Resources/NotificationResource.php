<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);

        return [
            'id' => $this->id,
            'notifiable_id' => $this->notifiable_id,
            'title' => $this->data['title'],
            'message' => $this->data['message'],
            'read_at' => $this->read_at,
        ];
    }
}
