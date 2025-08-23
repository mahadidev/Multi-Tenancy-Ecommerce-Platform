<?php

namespace App\Modules\WebsiteBuilder\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateStoreWebsiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'template_id' => 'nullable|exists:website_templates,id',
            'domain' => 'nullable|string|max:255|unique:store_websites,domain',
            'subdomain' => 'required|string|max:255|unique:store_websites,subdomain|regex:/^[a-z0-9-]+$/',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'favicon' => 'nullable|string|max:255',
            'seo_meta' => 'nullable|json',
            'global_styles' => 'nullable|json',
            'analytics_settings' => 'nullable|json',
            'meta_data' => 'nullable|json',
        ];
    }

    public function messages(): array
    {
        return [
            'subdomain.required' => 'A subdomain is required for your website.',
            'subdomain.unique' => 'This subdomain is already taken. Please choose another.',
            'subdomain.regex' => 'Subdomain can only contain lowercase letters, numbers, and hyphens.',
            'domain.unique' => 'This domain is already in use.',
            'title.required' => 'Website title is required.',
        ];
    }
}