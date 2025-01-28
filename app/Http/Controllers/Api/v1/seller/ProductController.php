<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Exports\ProductsExport;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
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
        return response()->json([
            'status' => 200,
            'data' => [
                'products' => ProductService::index($request),
            ],
            'meta' => [
                'current_page' => ProductService::index($request)->currentPage(),
                'first_page_url' => ProductService::index($request)->url(1),
                'last_page' => ProductService::index($request)->lastPage(),
                'last_page_url' => ProductService::index($request)->url(ProductService::index($request)->lastPage()),
                'next_page_url' => ProductService::index($request)->nextPageUrl(),
                'prev_page_url' => ProductService::index($request)->previousPageUrl(),
                'total' => ProductService::index($request)->total(),
                'per_page' => ProductService::index($request)->perPage(),
            ],
        ], 200);
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
            'message' => 'product created successfully',
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
                    'message' => 'product not found',
                ],
                404,
            );
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'product updated successfully',
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
                'data' => [
                    'product' => $product,
                ],
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

            // if ($request->has('download')) {
            //     return Excel::download(new ProductsExport, $fileName);
            // }

            // // Store the file temporarily and return a response with file info
            // Excel::store(new ProductsExport, 'temp/' . $fileName, 'public');

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
                'message' => 'Failed to export Products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
