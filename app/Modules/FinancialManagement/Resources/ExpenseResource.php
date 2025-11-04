<?php

namespace App\Modules\FinancialManagement\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'amount' => $this->amount,
            'formatted_amount' => $this->formatted_amount,
            'category' => $this->category,
            'category_label' => $this->category_label,
            'payment_method' => $this->payment_method,
            'payment_method_label' => $this->payment_method_label,
            'vendor_id' => $this->vendor_id,
            'vendor' => $this->whenLoaded('vendor', function () {
                return $this->vendor ? [
                    'id' => $this->vendor->id,
                    'name' => $this->vendor->name,
                    'phone' => $this->vendor->phone,
                    'email' => $this->vendor->email,
                ] : null;
            }),
            'receipt_number' => $this->receipt_number,
            'expense_date' => $this->expense_date?->format('Y-m-d'),
            'expense_date_formatted' => $this->expense_date?->format('M d, Y'),
            'status' => $this->status,
            'status_label' => $this->status_label,
            'status_color' => $this->status_color,
            'notes' => $this->notes,
            'attachments' => $this->formatAttachments(),
            
            // Relationships
            'store' => $this->whenLoaded('store', function () {
                return $this->store ? [
                    'id' => $this->store->id,
                    'name' => $this->store->name,
                ] : null;
            }),
            
            'user' => $this->whenLoaded('user', function () {
                return $this->user ? [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ] : null;
            }),
            
            // Metadata
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'created_at_human' => $this->created_at?->diffForHumans(),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'updated_at_human' => $this->updated_at?->diffForHumans(),
        ];
    }

    /**
     * Format attachments with full URLs
     */
    private function formatAttachments(): array
    {
        if (!$this->attachments) {
            return [];
        }

        return collect($this->attachments)->map(function ($attachment) {
            return [
                'path' => $attachment,
                'url' => asset('storage/' . $attachment),
                'name' => basename($attachment),
                'extension' => pathinfo($attachment, PATHINFO_EXTENSION),
            ];
        })->toArray();
    }
}