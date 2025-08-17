<?php
namespace App\Modules\ProductManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Modules\ProductManagement\Models\Product;
use App\Modules\ProductManagement\Services\ProductService;
use App\Modules\ProductManagement\Services\ProductFetcherService;
use App\Modules\ProductManagement\Services\ProductCreatorService;
use App\Modules\ProductManagement\Services\ProductUpdaterService;
use App\Modules\ProductManagement\Services\ProductDeleterService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;
    protected $productFetcher;
    protected $productCreator;
    protected $productUpdater;
    protected $productDeleter;

    public function __construct()
    {
        $this->productService = new ProductService();
        $this->productFetcher = new ProductFetcherService();
        $this->productCreator = new ProductCreatorService();
        $this->productUpdater = new ProductUpdaterService();
        $this->productDeleter = new ProductDeleterService();
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page'); // Items per page, optional

        $products = $this->productFetcher->index($request);

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
        $product = $this->productFetcher->show($id);

        return response()->json([
            'status' => 200,
            'data' => [
                'product' => $product,
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $product = $this->productCreator->handle($request);

        return response()->json([
            'status' => 200,
            'message' => 'Product created successfully',
            'product' => [
                'product' => $product,
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = $this->productUpdater->handle($request, $id);

        return response()->json([
            'status' => 200,
            'message' => 'Product updated successfully',
            'data' => [
                'product' => $product,
            ],
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $product = $this->productDeleter->handle($id);

        return response()->json([
            'status' => 200,
            'message' => 'product deleted successfully',
        ], 200);
    }

    public function pdf(Request $request)
    {
        $pdf = $this->productService->getPdfDownload($request);
        return $pdf->download('products_' . now()->format('Ymd_His') . '.pdf');
    }

    public function excel(Request $request)
    {
        return $this->productService->getExcelDownload($request);
    }

    public function getSummary(Request $request, Product $product)
    {
        $range = $request->input('range', 'today');

        try {
            $reportData = $this->productService->getSummary($range);

            return response()->json([
                'status' => 200,
                'data' => [
                    'summary' => $reportData,
                ],
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'status' => 400,
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}