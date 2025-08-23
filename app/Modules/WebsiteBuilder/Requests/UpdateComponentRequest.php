<?php

namespace App\Modules\WebsiteBuilder\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComponentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'props' => 'nullable|json',
            'styles' => 'nullable|json',
            'sort_order' => 'nullable|integer|min:0',
            'is_visible' => 'boolean',
            'responsive_settings' => 'nullable|json',
            'animation_settings' => 'nullable|json',
            'meta_data' => 'nullable|json',
        ];
    }
}