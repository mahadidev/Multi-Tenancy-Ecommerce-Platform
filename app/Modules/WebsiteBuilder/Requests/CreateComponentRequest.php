<?php

namespace App\Modules\WebsiteBuilder\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateComponentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'section_id' => 'required|exists:page_sections,id',
            'component_type_id' => 'required|exists:component_types,id',
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

    public function messages(): array
    {
        return [
            'section_id.required' => 'Section is required.',
            'section_id.exists' => 'Selected section does not exist.',
            'component_type_id.required' => 'Component type is required.',
            'component_type_id.exists' => 'Selected component type does not exist.',
        ];
    }
}