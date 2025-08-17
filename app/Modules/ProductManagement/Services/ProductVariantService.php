<?php

namespace App\Modules\ProductManagement\Services;

use App\Http\Resources\ProductVariantResource;
use App\Modules\ProductManagement\Models\Product;
use App\Modules\ProductManagement\Models\ProductVariant;
use App\Modules\ProductManagement\Models\ProductVariantOption;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProductVariantService
{
    public function createVariant(Product $product, $variant)
    {
        $this->validateVariant($product, $variant);

        $productVariant = ProductVariant::create([
            'product_id' => $product->id,
            'label' => $variant['label']
        ]);

        foreach ($variant['options'] as $option) {
            ProductVariantOption::create([
                'variant_id' => $productVariant->id,
                'label' => $option['label'] ?? null,
                'slug' => $option['slug'] ?? null,
                'code' => $option['code'] ?? null,
                'price' => $option['price'] ?? 0,
                'qty_stock' => $option['qty_stock'] ?? 0,
            ]);
        }

        $product->update([
            'has_variants' => true,
            'has_in_stocks' => true,
        ]);

        return new ProductVariantResource($productVariant);
    }

    public function updateVariant(Product $product, $variant)
    {
        // Check if 'id' exists in the payload
        if (empty($variant['id'])) {
            throw ValidationException::withMessages([
                'id' => 'Variant ID is missing/invalid for update.',
            ]);
        }

        // Must include 'id' of the variant in the payload
        $this->validateVariant($product, $variant, $variant['id'] ?? null);

        // Find the existing variant
        $productVariant = ProductVariant::where('product_id', $product->id)
            ->where('id', $variant['id'])
            ->firstOrFail();

        // Update the label
        $productVariant->update([
            'label' => $variant['label'],
        ]);

        // Delete existing options
        $productVariant->options()->delete();

        // Recreate options
        foreach ($variant['options'] as $option) {
            ProductVariantOption::create([
                'variant_id' => $productVariant->id,
                'label' => $option['label'] ?? null,
                'slug' => $option['slug'] ?? null,
                'code' => $option['code'] ?? null,
                'price' => $option['price'] ?? 0,
                'qty_stock' => $option['qty_stock'] ?? 0,
            ]);
        }

        $product->update([
            'has_variants' => true,
            'has_in_stocks' => true,
        ]);

        return new ProductVariantResource($productVariant);
    }

    public function createOrUpdateVariants(Product $product, $variants)
    {
        $this->validateVariants($product, $variants);

        $product->variants()->delete();

        $createdVariants = [];

        foreach ($variants as $variant) {
            $productVariant = ProductVariant::create([
                'product_id' => $product->id,
                'label' => $variant['label'],
                'slug' => $variant['slug'] ?? null,
            ]);

            foreach ($variant['options'] as $option) {
                ProductVariantOption::create([
                    'variant_id' => $productVariant->id,
                    'label' => $option['label'] ?? null,
                    'slug' => $option['slug'] ?? null,
                    'code' => $option['code'] ?? null,
                    'price' => $option['price'] ?? 0,
                    'qty_stock' => $option['qty_stock'] ?? 0,
                ]);
            }

            $createdVariants[] = $productVariant;
        }

        $product->update([
            'has_variants' => true,
            'has_in_stocks' => true,
        ]);

        return $createdVariants;
    }

    public function deleteVariant(Product $product, $variant)
    {
        if (!$variant) {
            throw ValidationException::withMessages([
                'variant' => 'Variant not found for this product.',
            ]);
        }

        // Delete associated options
        $variant->options()->delete();

        // Delete the variant itself
        $variant->delete();

        // Check if the product still has variants
        $hasVariants = $product->variants()->exists();
        $hasStock = $product->variants()->whereHas('options', function ($query) {
            $query->where('qty_stock', '>', 0);
        })->exists();

        $product->update([
            'has_variants' => $hasVariants,
            'has_in_stocks' => $hasStock,
        ]);

        return response()->json([
            'message' => 'Variant deleted successfully.',
        ]);
    }


    protected function validateVariant($product, $variant, $variantId = null)
    {
        $validator = Validator::make(
            $variant,
            [
                'label' => [
                    'required',
                    'string',
                    function ($attribute, $value, $fail) use ($product, $variantId) {
                        $query = $product->variants()->where('label', $value);
                        if ($variantId) {
                            $query->where('id', '!=', $variantId);
                        }
                        if ($query->exists()) {
                            $fail("The {$attribute} '{$value}' already exists for this product.");
                        }
                    },
                ],
                'options' => 'array',
                'options.*.label' => 'required|string|max:255',
                'options.*.qty_stock' => 'nullable|integer|min:0',
                'options.*.price' => 'nullable|numeric|min:0',
                'options.*.code' => 'nullable|string|max:255',
                'options.*.slug' => 'nullable|string|max:255',
            ]
        );

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    protected function validateVariants($product, array $variants)
    {
        $validator = Validator::make(
            ['variants' => $variants],
            [
                'variants' => 'required|array',
                'variants.*.label' => [
                    'required',
                    'string',
                    function ($attribute, $value, $fail) use ($product) {
                        if (
                            $product->variants()
                                ->where('label', $value)
                                ->exists()
                        ) {
                            $fail("The {$attribute} '{$value}' already exists for this product.");
                        }
                    },
                ],
                'variants.*.slug' => 'nullable|string|max:255',
                'variants.*.options' => 'required|array|min:1',
                'variants.*.options.*.label' => 'required|string|max:255',
                'variants.*.options.*.slug' => 'nullable|string|max:255',
                'variants.*.options.*.price' => 'nullable|numeric|min:0',
                'variants.*.options.*.qty_stock' => 'nullable|integer|min:0',
                'variants.*.options.*.code' => 'nullable|string|max:255',
            ]
        );

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}
