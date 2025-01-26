<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use App\Imports\BrandsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\ValidationException;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        // Retrieve query parameters
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort', 'desc'); // Sort order, default is 'desc'
        $perPage = $request->input('per_page', 10); // Items per page, default is 10

        // Fetch brands with optional search and sorting, paginated
        $brands = Brand::authorized()
            ->when($search, function ($query, $search) {
                $query
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%')
                    ->where('store_id', authStore());
            })
            ->orderBy('created_at', $sort) // Sort by 'created_at' in the specified order
            ->paginate($perPage);

        return response()->json(
            [
                'status' => 200,
                'data' => [
                    'brands' => BrandResource::collection($brands),
                ],
                'meta' => [
                    'current_page' => $brands->currentPage(),
                    'first_page_url' => $brands->url(1),
                    'last_page' => $brands->lastPage(),
                    'last_page_url' => $brands->url($brands->lastPage()),
                    'next_page_url' => $brands->nextPageUrl(),
                    'prev_page_url' => $brands->previousPageUrl(),
                    'total' => $brands->total(),
                    'per_page' => $brands->perPage(),
                ],
            ],
            200,
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|string|max:255',
        ]);

        $validated['store_id'] = authStore();

        $brand = Brand::create([
            'name' => $validated['name'],
            'store_id' => $validated['store_id'],
            'image' => $validated['image'] ?? null,
        ]);

        return response()->json(
            [
                'status' => 200,
                'message' => 'Brand created successfully',
                'data' => [
                    'brand' => new BrandResource($brand),
                ],
            ],
            200,
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $brand = Brand::authorized()->find($id);

        if (!$brand) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Brand not found',
                ],
                404,
            );
        }

        return response()->json(
            [
                'status' => 200,
                'data' => [
                    'brand' => new BrandResource($brand),
                ],
            ],
            200,
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $brand = Brand::authorized()->find($id);

        if (!$brand) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Brand not found',
                ],
                404,
            );
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
        ]);

        $brand->update([
            'name' => $validated['name'] ?? $brand->name,
            'image' => $validated['image'] ?? $brand->image,
        ]);

        return response()->json(
            [
                'status' => 200,
                'message' => 'Brand updated successfully',
                'data' => [
                    'brand' => new BrandResource($brand),
                ],
            ],
            200,
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brand::authorized()->find($id);

        if (!$brand) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Brand not found',
                ],
                404,
            );
        }

        $brand->delete();

        return response()->json(
            [
                'success' => 200,
                'message' => 'Brand deleted successfully',
            ],
            200,
        );
    }

    public function pdf(Request $request)
    {
        $brands = Brand::authorized()->get();

        $pdf = FacadePdf::loadView('pdf.brand', compact('brands'))->setPaper('a4');

        return $pdf->download('brands_' . now()->format('Ymd_His') . '.pdf');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        $file = $request->file('file');

        try {
            Excel::import(new BrandsImport, $file);

            $brands = Brand::authorized()->latest()->paginate(10);

            return response()->json([
                'status' => 200,
                'message' => 'Brands imported successfully',
                'data' => [
                    'brands' => BrandResource::collection($brands),
                ],
                'meta' => [
                    'current_page' => $brands->currentPage(),
                    'first_page_url' => $brands->url(1),
                    'last_page' => $brands->lastPage(),
                    'last_page_url' => $brands->url($brands->lastPage()),
                    'next_page_url' => $brands->nextPageUrl(),
                    'prev_page_url' => $brands->previousPageUrl(),
                    'total' => $brands->total(),
                    'per_page' => $brands->perPage(),
                ],
            ]);
        } catch (ValidationException $e) {
            $failures = $e->failures();

            return response()->json([
                'status' => 422,
                'message' => 'Import validation failed',
                'errors' => collect($failures)->map(function ($failure) {
                    return [
                        'row' => $failure->row(),
                        'attribute' => $failure->attribute(),
                        'errors' => $failure->errors()
                    ];
                })
            ], 422);
        }
    }
}
