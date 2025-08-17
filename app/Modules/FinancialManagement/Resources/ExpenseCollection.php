<?php

namespace App\Modules\FinancialManagement\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ExpenseCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return ExpenseResource::collection($this->collection)->toArray($request);
    }

    /**
     * Get additional data that should be returned with the resource array.
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'total_items' => $this->collection->count(),
                'total_amount' => $this->collection->sum('amount'),
                'average_amount' => $this->collection->avg('amount'),
            ],
        ];
    }
}
