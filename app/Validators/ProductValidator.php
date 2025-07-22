<?php

namespace App\Validators;

use Illuminate\Http\Request;

class ProductValidator
{
    public static function validate(Request $request, bool $isUpdate = false): array
    {
        $rules = [
            'category_id' => ($isUpdate ? 'nullable' : 'required') . '|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'name' => ($isUpdate ? 'nullable' : 'required') . '|string|max:255',
            'slug' => ($isUpdate ? 'nullable' : 'required') . '|string|max:255',
            'sku' => ($isUpdate ? 'nullable' : 'required'),
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'string',
            'buying_price' => 'nullable|numeric',
            'price' => ($isUpdate ? 'nullable' : 'required') . '|numeric',
            'stock' => ($isUpdate ? 'nullable' : 'required') . '|integer',
            'has_variants' => 'nullable|boolean',
            'variants_type' => 'nullable|in:basic,advance',
            'has_in_stocks' => 'nullable|boolean',
            'status' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_trending' => 'nullable|boolean',
            'has_discount' => 'nullable|boolean',
            'discount_to' => 'nullable|date',
            'discount_type' => 'nullable|string|in:flat,percentage',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax' => 'nullable|integer',
            'variants' => 'nullable|array|required_if:has_variants,1',
            'variants.*.label' => 'required|string|max:255',
            'variants.*.slug' => 'nullable|string|max:255',
            'variants.*.options' => 'required|array|min:1',
            'variants.*.options.*.label' => 'required|max:255',
            'variants.*.options.*.slug' => 'nullable|max:255',
            'variants.*.options.*.price' => 'nullable|numeric|min:0',
            'variants.*.options.*.qty_stock' => 'nullable|integer|min:0',
            'variants.*.options.*.code' => 'nullable',
        ];

        return $request->validate($rules);
    }
}
