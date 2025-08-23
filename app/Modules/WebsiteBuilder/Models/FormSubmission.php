<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormSubmission extends Model
{
    protected $fillable = [
        'form_id',
        'data',
        'ip_address',
        'user_agent',
        'is_read',
    ];

    protected $casts = [
        'data' => 'json',
        'is_read' => 'boolean',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(WebsiteForm::class, 'form_id');
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }

    public function getFormattedDataAttribute(): array
    {
        $data = $this->data ?? [];
        $form = $this->form;
        $fields = $form->fields ?? [];
        
        $formatted = [];
        
        foreach ($fields as $field) {
            $name = $field['name'] ?? '';
            $label = $field['label'] ?? $name;
            $value = $data[$name] ?? '';
            
            $formatted[] = [
                'label' => $label,
                'value' => $value,
                'type' => $field['type'] ?? 'text',
            ];
        }
        
        return $formatted;
    }
}