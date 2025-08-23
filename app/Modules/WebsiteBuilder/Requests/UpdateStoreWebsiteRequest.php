<?php

namespace App\Modules\WebsiteBuilder\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStoreWebsiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $websiteId = $this->route('id');

        return [
            'template_id' => 'nullable|exists:website_templates,id',
            'domain' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('store_websites', 'domain')->ignore($websiteId)
            ],
            'subdomain' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('store_websites', 'subdomain')->ignore($websiteId)
            ],
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'favicon' => 'nullable|string|max:255',
            'seo_meta' => 'nullable|json',
            'global_styles' => 'nullable|json',
            'analytics_settings' => 'nullable|json',
            'is_maintenance_mode' => 'boolean',
            'maintenance_message' => 'nullable|string|max:500',
            'meta_data' => 'nullable|json',
        ];
    }

    public function messages(): array
    {
        return [
            'subdomain.unique' => 'This subdomain is already taken. Please choose another.',
            'subdomain.regex' => 'Subdomain can only contain lowercase letters, numbers, and hyphens.',
            'domain.unique' => 'This domain is already in use.',
            'title.required' => 'Website title is required.',
        ];
    }
}