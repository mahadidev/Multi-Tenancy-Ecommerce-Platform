<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
class ProductService
{

    public static function index(Request $request)
    {
        $query = Product::with('category','store','variants')->authorized();

        // if ($request->has('category') && $request->input('category') != '') {
        //     $query->whereIn('category_id', $request->input('category'));
        // }

        // if (($request->has('brands'))) {
        //     $query->whereIn('category_id', $request->input('brands'));
        // }

        // Apply filter sorting
        // if ($request->has('filter')) {
        //     $filter = $request->input('filter');

        //     if ($filter == 'trending') {
        //         $query->where('is_trend', 1);
        //     } elseif ($filter == 'a_z') {
        //         $query->orderBy('name', 'ASC');
        //     } elseif ($filter == 'z_a') {
        //         $query->orderBy('name', 'DESC');
        //     } elseif ($filter == 'low_high') {
        //         $query->orderBy('price', 'ASC');
        //     } elseif ($filter == 'high_low') {
        //         $query->orderBy('price', 'DESC');
        //     } else {
        //         $query->latest(); // Default sorting by latest if no specific filter applied
        //     }
        // } else {
        //     $query->latest(); // Apply latest sorting if no filter is provided
        // }

        // if ($request->has('range')) {
        //     $min = $request->input('range')['min'];
        //     $max = $request->input('range')['max'];
        //     $query->whereBetween('price', [$min, $max]);
        // }


        // if ($request->has('paginate')) {
        //     $products = $query->paginate($request->input('perPage'));
        //     return $products;
        // }

        $products = $query->get();

        return ProductResource::collection($products);
    }

    public static function show(Request $request, $id){

        $product = Product::authorized()->findorfail($id);
        return new ProductResource($product);

    }

    public static function store(Request $request)
    {

        // Validate the incoming data
        $validatedData = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:10048',
            'attachments' => 'required|array',
            'attachments.*' => 'file|mimes:jpeg,png,jpg|max:10048',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'has_variants' => 'required|boolean',
            'has_in_stocks' => 'required|boolean',
            'status' => 'required|boolean',
        ]);

        // Add the authenticated store ID to the data
        $validatedData['store_id'] = authStore();
        
        // Handle the thumbnail file upload if present
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('products', 'public');
        }

        // Handle the attachments (if any)
        $attachments = [];
        if ($request->has('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $attachments[] = $file->store('products', 'public');
            }
        }

        // Create the product entry
        $product = Product::create([
            'store_id' => $validatedData['store_id'],
            'category_id' => $validatedData['category_id'],
            'name' => $validatedData['name'],
            'slug' => $validatedData['slug'],
            'sku' => $validatedData['sku'],
            'description' => $validatedData['description'],
            'thumbnail' => $thumbnailPath,  // Save the thumbnail path
            'attachments' => $attachments ? $attachments : null,  // Save the attachments as JSON
            'price' => $validatedData['price'],
            'stock' => $validatedData['stock'],
            'has_variants' => $validatedData['has_variants'],
            'has_in_stocks' => $validatedData['has_in_stocks'],
            'status' => $validatedData['status'],
        ]);

        // Return the created product response
        return $product;
    }
}