<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Storage;

class ProductService
{

    public static function index(Request $request)
    {
        $query = Product::with('category', 'store', 'variants', 'brand')->authorized();

        $products = $query->paginate($request->per_page ?? 10);

        return ProductResource::collection($products);
    }

    public static function show(Request $request, $id)
    {
        $product = Product::with('category', 'store', 'variants', 'brand')->authorized()->find($id);
        if (!$product) {
            return null;
        }
        return new ProductResource($product);
    }

    public static function store(Request $request)
    {
        // Validate the incoming data
        $validatedData = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string|max:255',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:jpeg,png,jpg|max:10048',
            'price' => 'required|numeric',
            'stock' => 'nullable|integer',
            'has_variants' => 'nullable|boolean',
            'has_in_stocks' => 'nullable|boolean',
            'status' => 'nullable|boolean',

            'is_trending' => 'nullable|boolean',
            'has_discount' => 'nullable|boolean',
            'discount_to' => 'nullable|date',
            'discount_type' => 'nullable|string|in:flat,percentage',
            'discount_amount' => 'nullable|numeric|min:0',

            'variants' => 'nullable|array|required_if:has_variants,1',
            'variants.*.label' => 'required|string|max:255',
            'variants.*.options' => 'required|array|min:1',
            'variants.*.options.*.label' => 'required|string|max:255',
            'variants.*.options.*.price' => 'required|numeric|min:0',
            'variants.*.options.*.qty_stock' => 'required|integer|min:0',
            'variants.*.options.*.code' => 'nullable|string',

        ]);

        // Add the authenticated store ID to the data
        $validatedData['store_id'] = authStore();


        // Handle the attachments (if any)
        $attachments = [];
        if ($request->has('attachments') && isset($request->attachments)) {
            foreach ($request->file('attachments') as $file) {
                $attachments[] = $file->store('products', 'public');
            }
        }

        // Create the product entry
        $product = Product::create([
            'store_id' => $validatedData['store_id'],
            'category_id' => $validatedData['category_id'],
            'brand_id' => $validatedData['brand_id'] ?? null,
            'name' => $validatedData['name'],
            'slug' => $validatedData['slug'],
            'sku' => $validatedData['sku'],
            'short_description' => $validatedData['short_description'] ?? null,
            'description' => $validatedData['description'] ?? null,
            'thumbnail' => $validatedData["thumbnail"],  // Save the thumbnail path
            'attachments' => $attachments ? $attachments : null,  // Save the attachments as JSON
            'price' => $validatedData['price'],
            'stock' => $validatedData['stock'] ?? null,
            'has_variants' => $validatedData['has_variants'] ?? false,
            'has_in_stocks' => $validatedData['has_in_stocks'] ?? false,
            'status' => $validatedData['status'] ?? 1,
            'is_trending' => $validatedData['is_trending'] ?? false,
            'has_discount' => $validatedData['has_discount'] ?? false,
            'discount_to' => $validatedData['discount_to'] ?? null,
            'discount_type' => $validatedData['discount_type'] ?? null,
            'discount_amount' => $validatedData['discount_amount'] ?? null,
        ]);


        if ($request->has('variants')) {
            foreach ($request->variants as $variant) {
                // Ensure the options are formatted correctly as an array
                $options = collect($variant['options'])->map(function ($option) {
                    return [
                        'code' => $option['code'] ?? null,  // Ensure 'code' is null if not provided
                        'label' => $option['label'],
                        'price' => $option['price'],
                        'qty_stock' => $option['qty_stock'],
                    ];
                })->toArray();

                // Create the variant record
                $productVariant = ProductVariant::create([
                    'product_id' => $product->id,
                    'label' => $variant['label'],
                    'options' => ($options),  // Save options as a JSON-encoded string
                ]);
            }
        }

        // Return the created product response
        return new ProductResource($product);
    }


    public static function update(Request $request, $id)
    {

        $product = Product::with('category', 'store', 'variants', 'brand')->authorized()->find($id);
        if (!$product) {
            return null;
        }
        // Validate the incoming data
        $validatedData = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sku' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string|max:255',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:jpeg,png,jpg|max:10048',
            'price' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'has_variants' => 'nullable|boolean',
            'has_in_stocks' => 'nullable|boolean',
            'status' => 'nullable|boolean',

            'is_trending' => 'nullable|boolean',
            'has_discount' => 'nullable|boolean',
            'discount_to' => 'nullable|date',
            'discount_type' => 'nullable|string|in:flat,percentage',
            'discount_amount' => 'nullable|numeric|min:0',

            'variants' => 'nullable|array|required_if:has_variants,1',
            'variants.*.label' => 'required|string|max:255',
            'variants.*.options' => 'required|array|min:1',
            'variants.*.options.*.label' => 'required|string|max:255',
            'variants.*.options.*.price' => 'required|numeric|min:0',
            'variants.*.options.*.qty_stock' => 'required|integer|min:0',
            'variants.*.options.*.code' => 'nullable|string',
        ]);


        // Handle the attachments (if any)
        if ($request->hasFile('attachments')) {
            // Delete old attachments if they exist
            if ($product->attachments) {
                $oldAttachments = json_decode($product->attachments, true);
                foreach ($oldAttachments as $attachment) {
                    Storage::disk('public')->delete($attachment);
                }
            }

            $validatedData['attachments'] = array_map(fn($file) => $file->store('products', 'public'), $request->file('attachments'));
        }

        // Update the product entry
        $product->update([
            'category_id' => $validatedData['category_id'] ?? $product->category_id,
            'brand_id' => $validatedData['brand_id'] ?? $product->brand_id,
            'name' => $validatedData['name'] ?? $product->name,
            'slug' => $validatedData['slug'] ?? $product->slug,
            'sku' => $validatedData['sku'] ?? $product->sku,
            'short_description' => $validatedData['short_description'] ?? $product->short_description,
            'description' => $validatedData['description'] ?? $product->description,
            'thumbnail' => $validatedData['thumbnail'] ?? $product->thumbnail, // Keep the old thumbnail if not updated
            'attachments' => isset($validatedData['attachments']) ? $validatedData['attachments'] : $product->attachments, // Keep the old attachments if not updated
            'price' => $validatedData['price'] ?? $product->price,
            'stock' => $validatedData['stock'] ?? $product->stock,
            'has_variants' => $validatedData['has_variants'] ?? $product->has_variants,
            'has_in_stocks' => $validatedData['has_in_stocks'] ?? $product->has_in_stocks,
            'status' => $validatedData['status'] ?? $product->status,
            'is_trending' => $validatedData['is_trending'] ?? $product->is_trending,
            'has_discount' => $validatedData['has_discount'] ?? $product->has_discount,
            'discount_to' => $validatedData['discount_to'] ?? $product->discount_to,
            'discount_type' => $validatedData['discount_type'] ?? $product->discount_type,
            'discount_amount' => $validatedData['discount_amount'] ?? $product->discount_amount,
        ]);

        // Handle variants if present
        if (!empty($validatedData['variants'])) {
            // Delete existing variants
            $product->variants()->delete();

            // Add new variants
            foreach ($validatedData['variants'] as $variant) {
                $options = collect($variant['options'])->map(fn($option) => [
                    'code' => $option['code'] ?? null,
                    'label' => $option['label'],
                    'price' => $option['price'],
                    'qty_stock' => $option['qty_stock'],
                ])->toArray();

                ProductVariant::create([
                    'product_id' => $product->id,
                    'label' => $variant['label'],
                    'options' => $options, // Save options as JSON
                ]);
            }
        }

        // Return the updated product response
        return new ProductResource($product);
    }

    public static function destroy(Request $request, $id)
    {
        $product = Product::authorized()->find($id);
        if (!$product) {
            return null;
        }
        $product->delete();

        return 'product deleted successfully.';
    }
}
