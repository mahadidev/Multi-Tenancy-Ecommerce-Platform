<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Exports\ProductsExport;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductVariantOption;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use App\Models\Store;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page'); // Items per page, optional

        $products = ProductService::index($request);

        $response = [
            'status' => 200,
            'data' => [
                'products' => ProductResource::collection($products),
            ],
        ];

        if ($perPage) {
            $response['meta'] = [
                'current_page' => $products->currentPage(),
                'first_page_url' => $products->url(1),
                'last_page' => $products->lastPage(),
                'last_page_url' => $products->url($products->lastPage()),
                'next_page_url' => $products->nextPageUrl(),
                'prev_page_url' => $products->previousPageUrl(),
                'total' => $products->total(),
                'per_page' => $products->perPage(),
            ];
        }

        return response()->json($response, 200);
    }

    public function show(Request $request, $id)
    {
        $product = ProductService::show($request, $id);
        if ($product == null) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'product not found',
                ],
                404,
            );
        } else {
            return response()->json([
                'status' => 200,
                'data' => [
                    'product' => $product,
                ],
            ], 200);
        }
    }

    public function store(Request $request)
    {
        return response()->json([
            'status' => 200,
            'message' => 'Product created successfully',
            'product' => [
                'product' => ProductService::store($request),
            ],
        ],);
    }

    public function update(Request $request, $id)
    {
        $product = ProductService::update($request, $id);
        if ($product == null) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Product not found',
                ],
                404,
            );
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'Product updated successfully',
                'data' => [
                    'product' => $product,
                ],
            ], 200);
        }
    }

    public function destroy(Request $request, $id)
    {
        $product = ProductService::destroy($request, $id);
        if ($product == null) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'product not found',
                ],
                404,
            );
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'product deleted successfully',
            ], 200);
        }
    }

    public function pdf(Request $request)
    {
        $products = ProductService::index($request);
        $store = Store::select('id', 'logo', 'name', 'phone', 'domain', 'location', 'email', 'currency')->find(authStore());
        $store->domain = $store->domain();
        $pdf = FacadePdf::loadView('pdf.products', compact('products', 'store'))->setPaper('a4');
        return $pdf->download('products_' . now()->format('Ymd_His') . '.pdf');
    }

    public function excel(Request $request)
    {
        try {
            $fileName = 'product_' . now()->format('Ymd_His') . '.xlsx';

            return Excel::download(new ProductsExport, $fileName); 
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to export Products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}

// class ProductController extends Controller
// {
//     public function index(Request $request)
//     {
//         $sort = $request->input('sort'); // Sort order
//         $perPage = $request->input('per_page'); // Items per page, optional

//         $query = Product::authorized();
        
//         $this->applyFiltersAndSorting($query, $request);

//         $products = $query
//                 ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

//         // Paginate or get all results based on the presence of `per_page`
//         $paginated = $perPage ? $products->paginate($perPage) : $products->get();

//         $productsCollection = ProductResource::collection($paginated);

//         $response = [
//             'status' => 200,
//             'data' => [
//                 'products' => $productsCollection,
//             ],
//         ];

//         if ($perPage) {
//             $response['meta'] = [
//                 'current_page' => $paginated->currentPage(),
//                 'first_page_url' => $paginated->url(1),
//                 'last_page' => $paginated->lastPage(),
//                 'last_page_url' => $paginated->url($paginated->lastPage()),
//                 'next_page_url' => $paginated->nextPageUrl(),
//                 'prev_page_url' => $paginated->previousPageUrl(),
//                 'total' => $paginated->total(),
//                 'per_page' => $paginated->perPage(),
//             ];
//         }

//         return response()->json(
//             [
//                 'status' => 200,
//                 'data' => [
//                     'products' => ProductResource::collection($products),
//                 ],
//             ],200,
//         );
//     }

//     public function show(Request $request, $id)
//     {
//         $product = Product::with('category', 'store', 'variants', 'brand')->authorized()->find($id);
//         if (!$product) {
//             return response()->json(
//                 [
//                     'status' => 404,
//                     'message' => 'product not found',
//                 ],
//                 404,
//             );
//         } else {
//             return response()->json([
//                 'status' => 200,
//                 'data' => [
//                     'product' => new ProductResource($product),
//                 ],
//             ], 200);
//         }
//     }

//     public function store(Request $request)
//     {
//         // Validate the incoming data
//         $validatedData = $request->validate([
//             'category_id' => 'required|exists:categories,id',
//             'brand_id' => 'nullable|exists:brands,id',
//             'name' => 'required|string|max:255',
//             'slug' => 'required|string|max:255',
//             'sku' => 'required|string|max:255',
//             'short_description' => 'nullable|string',
//             'description' => 'nullable|string',
//             'thumbnail' => 'required|string',
//             'attachments' => 'nullable|array',
//             'attachments.*' => 'string',
//             'price' => 'required|numeric',
//             'stock' => 'nullable|integer',
//             'has_variants' => 'nullable|boolean',
//             'has_in_stocks' => 'nullable|boolean',
//             'status' => 'nullable|boolean',
//             'is_trending' => 'nullable|boolean',
//             'has_discount' => 'nullable|boolean',
//             'discount_to' => 'nullable|date',
//             'discount_type' => 'nullable|string|in:flat,percentage',
//             'discount_amount' => 'nullable|numeric|min:0',
//             'variants' => 'nullable|array|required_if:has_variants,1',
//             'variants.*.label' => 'required|string|max:255',
//             'variants.*.slug' => 'nullable|string|max:255',
//             'variants.*.options' => 'required|array|min:1',
//             'variants.*.options.*.label' => 'required|string|max:255',
//             'variants.*.options.*.slug' => 'nullable|string|max:255',
//             'variants.*.options.*.price' => 'nullable|numeric|min:0',
//             'variants.*.options.*.qty_stock' => 'nullable|integer|min:0',
//             'variants.*.options.*.code' => 'nullable|string',
//         ]);

//         // Add the authenticated store ID to the data
//         $validatedData['store_id'] = authStore();

//         // Create the product entry
//         $product = Product::create([
//             'store_id' => $validatedData['store_id'],
//             'category_id' => $validatedData['category_id'],
//             'brand_id' => $validatedData['brand_id'] ?? null,
//             'name' => $validatedData['name'],
//             'slug' => $validatedData['slug'],
//             'sku' => $validatedData['sku'] ?? null,
//             'short_description' => $validatedData['short_description'] ?? null,
//             'description' => $validatedData['description'] ?? null,
//             'thumbnail' => $validatedData['thumbnail'] ?? null,
//             'attachments' => $validatedData['attachments'] ?? null,
//             'price' => $validatedData['price'],
//             'stock' => $validatedData['stock'] ?? null,
//             'has_variants' => $validatedData['has_variants'] ?? false,
//             'has_in_stocks' => $validatedData['has_in_stocks'] ?? false,
//             'status' => $validatedData['status'] ?? 1,
//             'is_trending' => $validatedData['is_trending'] ?? false,
//             'has_discount' => $validatedData['has_discount'] ?? false,
//             'discount_to' => $validatedData['discount_to'] ?? null,
//             'discount_type' => $validatedData['discount_type'] ?? null,
//             'discount_amount' => $validatedData['discount_amount'] ?? null,
//         ]);

//         // Handle variants if they exist
//         if ($request->has('variants')) {
//             foreach ($request->variants as $variant) {
//                 // Create the product variant record
//                 $productVariant = ProductVariant::create([
//                     'product_id' => $product->id,
//                     'label' => $variant['label'],
//                     'slug' => $variant['slug'],
//                 ]);

//                 // Handle variant options
//                 foreach ($variant['options'] as $option) {
//                     $productVariantOption = ProductVariantOption::create([
//                         'variant_id' => $productVariant->id,
//                         'label' => $option['label'] ?? null,
//                         'slug' => $option['slug'] ?? null,
//                         'code' => $option['code'] ?? null,
//                         'price' => $option['price'] ?? 0,
//                         'qty_stock' => $option['qty_stock'] ?? 0,
//                     ]);
//                 }
//             }
//         }

//         return response()->json([
//             'status' => 200,
//             'message' => 'Product created successfully',
//             'product' => [
//                 'product' => new ProductResource($product),
//             ],
//         ]);
//     }

//     public function update(Request $request, $id)
//     {
//         $product = Product::with('category', 'store', 'variants', 'brand')->authorized()->find($id);
//         if (!$product) {
//             return response()->json(
//                 [
//                     'status' => 404,
//                     'message' => 'Product not found',
//                 ],
//                 404,
//             );
//         }

//         // Validate the incoming data
//         $validatedData = $request->validate([
//             'category_id' => 'nullable|exists:categories,id',
//             'brand_id' => 'nullable|exists:brands,id',
//             'name' => 'nullable|string|max:255',
//             'slug' => 'nullable|string|max:255',
//             'sku' => 'nullable|string|max:255',
//             'short_description' => 'nullable|string',
//             'description' => 'nullable|string',
//             'thumbnail' => 'nullable|string',
//             'attachments' => 'nullable|array',
//             'attachments.*' => 'string',
//             'price' => 'nullable|numeric',
//             'stock' => 'nullable|integer',
//             'has_variants' => 'nullable|boolean',
//             'has_in_stocks' => 'nullable|boolean',
//             'status' => 'nullable|boolean',
//             'is_trending' => 'nullable|boolean',
//             'has_discount' => 'nullable|boolean',
//             'discount_to' => 'nullable|date',
//             'discount_type' => 'nullable|string|in:flat,percentage',
//             'discount_amount' => 'nullable|numeric|min:0',
//             'variants' => 'nullable|array|required_if:has_variants,1',
//             'variants.*.label' => 'required|string|max:255',
//             'variants.*.slug' => 'nullable|string|max:255',
//             'variants.*.options' => 'required|array|min:1',
//             'variants.*.options.*.label' => 'required|string|max:255',
//             'variants.*.options.*.slug' => 'nullable|string|max:255',
//             'variants.*.options.*.price' => 'nullable|numeric|min:0',
//             'variants.*.options.*.qty_stock' => 'nullable|integer|min:0',
//             'variants.*.options.*.code' => 'nullable|string',
//         ]);

//         // Update the product entry
//         $product->update([
//             'category_id' => $validatedData['category_id'] ?? $product->category_id,
//             'brand_id' => $validatedData['brand_id'] ?? $product->brand_id,
//             'name' => $validatedData['name'] ?? $product->name,
//             'slug' => $validatedData['slug'] ?? $product->slug,
//             'sku' => $validatedData['sku'] ?? $product->sku,
//             'short_description' => $validatedData['short_description'] ?? $product->short_description,
//             'description' => $validatedData['description'] ?? $product->description,
//             'thumbnail' => $validatedData['thumbnail'] ?? $product->thumbnail,
//             'attachments' => $validatedData['attachments'] ?? $product->attachments,
//             'price' => $validatedData['price'] ?? $product->price,
//             'stock' => $validatedData['stock'] ?? $product->stock,
//             'has_variants' => $validatedData['has_variants'] ?? $product->has_variants,
//             'has_in_stocks' => $validatedData['has_in_stocks'] ?? $product->has_in_stocks,
//             'status' => $validatedData['status'] ?? $product->status,
//             'is_trending' => $validatedData['is_trending'] ?? $product->is_trending,
//             'has_discount' => $validatedData['has_discount'] ?? $product->has_discount,
//             'discount_to' => $validatedData['discount_to'] ?? $product->discount_to,
//             'discount_type' => $validatedData['discount_type'] ?? $product->discount_type,
//             'discount_amount' => $validatedData['discount_amount'] ?? $product->discount_amount,
//         ]);

//         // Handle variants if present
//         if ($request->has('variants')) {
//             $product->variants()->delete();

//             // Add new variants
//             if(!empty($validatedData['variants'])){
//                 foreach ($validatedData['variants'] as $variant) {
//                     $productVariant = ProductVariant::create([
//                         'product_id' => $product->id,
//                         'label' => $variant['label'],
//                         'slug' => $variant['slug'],
//                     ]);
    
//                     // Add options for the variant
//                     foreach ($variant['options'] as $option) {
//                         $productVariantOption = ProductVariantOption::create([
//                             'variant_id' => $productVariant->id,
//                             'label' => $option['label'] ?? null,
//                             'slug' => $option['slug'] ?? null,
//                             'code' => $option['code'] ?? null,
//                             'price' => $option['price'] ?? 0,
//                             'qty_stock' => $option['qty_stock'] ?? 0,
//                         ]);
//                     }
//                 }
//             }
//         }

//         return response()->json([
//             'status' => 200,
//             'message' => 'Product updated successfully',
//             'data' => [
//                 'product' => new ProductResource($product->load('variants.options')),
//             ],
//         ], 200);
//     }

//     public function destroy(Request $request, $id)
//     {
//         $product = Product::authorized()->find($id);
//         if (!$product) {
//             return response()->json(
//                 [
//                     'status' => 404,
//                     'message' => 'product not found',
//                 ],
//                 404,
//             );
//         }
//         $product->delete();

//         return response()->json([
//             'status' => 200,
//             'message' => 'product deleted successfully',
//         ], 200);
//     }

//     public function pdf(Request $request)
//     {
//         $sort = $request->input('sort');
//         $query = Product::authorized();
        
//         $this->applyFiltersAndSorting($query, $request);

//         $products = $query
//                 ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());
        
//         $products = $products->get();

//         $store = Store::select('id', 'logo', 'name', 'phone', 'domain', 'location', 'email', 'currency')->find(authStore());
//         $store->domain = $store->domain();
//         $pdf = FacadePdf::loadView('pdf.products', compact('products', 'store'))->setPaper('a4');
//         return $pdf->download('products_' . now()->format('Ymd_His') . '.pdf');
//     }

//     public function excel(Request $request)
//     {
//         try {
//             $fileName = 'product_' . now()->format('Ymd_His') . '.xlsx';

//             return Excel::download(new ProductsExport, $fileName); 
            
//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => 500,
//                 'message' => 'Failed to export Products',
//                 'error' => $e->getMessage()
//             ], 500);
//         }
//     }

//     protected function applyFiltersAndSorting($query, Request $request)
//     {
//         // Essential Filters

//         // 1. Price Range - Most important for shoppers
//         if ($request->has('price_min')) {
//             $query->where('price', '>=', $request->price_min);
//         }
//         if ($request->has('price_max')) {
//             $query->where('price', '<=', $request->price_max);
//         }

//         // 2. Availability Filter - Critical for user experience
//         if ($request->has('in_stock')) {
//             $query->where('stock', '>', 0)->where('has_in_stocks', true);
//         }

//         // 3. Discounts - Important for price-sensitive customers
//         if ($request->has('on_sale')) {
//             $query->where('has_discount', true)->whereDate('discount_to', '>=', now());
//         }

//         // 4. Brand Filter - Key for brand-conscious shoppers
//         if ($request->has('brand_id')) {
//             $query->where('brand_id', $request->brand_id);
//         }

//         // 5. Search - Essential for finding specific products
//         if ($request->has('search')) {
//             $query->where(function ($q) use ($request) {
//                 $q->where('name', 'like', '%' . $request->search . '%')->orWhere('sku', 'like', '%' . $request->search . '%');
//             });
//         }

//         // 6. Trending Products - Important for showcasing popular products
//         if ($request->has('is_trending')) {
//             $query->where('is_trending', true);
//         }

//         // 7. Category Filter - Essential for category-specific products
//         if ($request->has('category_id')) {
//             $query->where('category_id', $request->category_id);
//         }

//         // Essential Sorting
//         $allowedSortFields = [
//             'created_at', // Latest products
//             'price', // Price sorting
//             'name', // Alphabetical
//             'is_trending', // Trending products
//         ];

//         return $query;
//     }
// }
