<?php

namespace App\Modules\WebsiteBuilder\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateWebsitePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $websiteId = $this->route('websiteId');

        return [
            'title' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('website_pages', 'slug')->where('website_id', $websiteId)
            ],
            'description' => 'nullable|string|max:1000',
            'type' => 'required|string|in:home,about,contact,product,category,blog,custom',
            'seo_meta' => 'nullable|json',
            'is_published' => 'boolean',
            'is_homepage' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'meta_data' => 'nullable|json',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Page title is required.',
            'slug.required' => 'Page slug is required.',
            'slug.unique' => 'This slug is already used in this website.',
            'slug.regex' => 'Slug can only contain lowercase letters, numbers, and hyphens.',
            'type.required' => 'Page type is required.',
            'type.in' => 'Invalid page type selected.',
        ];
    }
}