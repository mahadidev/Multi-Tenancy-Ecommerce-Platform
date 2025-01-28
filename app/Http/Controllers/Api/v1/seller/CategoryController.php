<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Store;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use App\Imports\CategoriesImport;
use App\Exports\CategoriesExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

// use App\Services\StoreService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::authorized()->latest();

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 10); // Items per page, default is 10

        $categories = $query->paginate($perPage)->appends($request->only(['type', 'search', 'per_page']));

        return response()->json([
            'status' => 200,
            'data' => [
                'categories' => CategoryResource::collection($categories),
            ],
            'meta' => [
                'current_page' => $categories->currentPage(),
                'first_page_url' => $categories->url(1),
                'last_page' => $categories->lastPage(),
                'last_page_url' => $categories->url($categories->lastPage()),
                'next_page_url' => $categories->nextPageUrl(),
                'prev_page_url' => $categories->previousPageUrl(),
                'total' => $categories->total(),
                'per_page' => $categories->perPage(),
            ],
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $category = Category::authorized()->find($id);
        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'category' => new CategoryResource($category),
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:50|in:post,product', // Correct format for 'in' rule
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        // Automatically assign the authenticated user's ID
        $validated['store_id'] = authStore();

        $category = Category::create($validated);

        return response()->json([
            'status' => 200,
            'message' => 'Category created successfully',
            'data' => [
                'category' => new CategoryResource($category),
            ],
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $category = Category::authorized()->find($id);
        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:50|in:post,product', // Correct format for 'in' rule
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        // Update the category
        $category->update($validated);

        return response()->json([
            'status' => 200,
            'message' => 'Category updated successfully',
            'data' => [
                'category' => new CategoryResource($category),
            ],
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $category = Category::authorized()->find($id);

        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }
        $category->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Category deleted successfully'
        ], 200);
    }

    public function pdf(Request $request)
    {
        $categories = Category::authorized()->where('type', 'product')->get();

        $store = Store::select('id', 'logo', 'name', 'phone', 'domain', 'location', 'email', 'currency')->find(authStore());
        $store->domain = $store->domain();

        $pdf = FacadePdf::loadView('pdf.category', compact('categories', 'store'))->setPaper('a4');

        return $pdf->download('categories_' . now()->format('Ymd_His') . '.pdf');
    }

    public function excel(Request $request)
    {
        try {
            $fileName = 'category_' . now()->format('Ymd_His') . '.xlsx';

            return Excel::download(new CategoriesExport, $fileName); 
             // Check if the request wants to force download
            // if ($request->has('download')) {
            //     return Excel::download(new CategoriesExport, $fileName);
            // }

            // // Store the file temporarily and return a response with file info
            // Excel::store(new CategoriesExport, 'temp/' . $fileName, 'public');

            // return response()->json([
            //     'status' => 200,
            //     'message' => 'Excel file generated successfully',
            //     'data' => [
            //         'filename' => $fileName,
            //         'download_url' => url('storage/temp/' . $fileName),
            //         'file_size' => Storage::disk('public')->size('temp/' . $fileName)
            //     ]
            // ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to export Categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        $file = $request->file('file');

        try {
            Excel::import(new CategoriesImport, $file);

            $categories = Category::authorized()->latest()->paginate(10);

            return response()->json([
                'status' => 200,
                'message' => 'Categories imported successfully',
                'data' => [
                    'categories' => CategoryResource::collection($categories),
                ],
                'meta' => [
                    'current_page' => $categories->currentPage(),
                    'first_page_url' => $categories->url(1),
                    'last_page' => $categories->lastPage(),
                    'last_page_url' => $categories->url($categories->lastPage()),
                    'next_page_url' => $categories->nextPageUrl(),
                    'prev_page_url' => $categories->previousPageUrl(),
                    'total' => $categories->total(),
                    'per_page' => $categories->perPage(),
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
