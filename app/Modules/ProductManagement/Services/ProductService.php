<?php

namespace App\Modules\ProductManagement\Services;

use App\Exports\ProductsExport;
use App\Models\Product;
use App\Models\Store;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Modules\ProductManagement\Services\ProductFetcherService;

class ProductService
{
    public $productFetcher;

    public function __construct() {
        $this->productFetcher = new ProductFetcherService();
    }

    public function getPdfDownload(Request $request)
    {
        $products = $this->productFetcher->index($request);

        $store = Store::select('id', 'logo', 'name', 'phone', 'domain', 'location', 'email', 'currency')->find(authStore());

        $store->domain = $store->domain();

        $pdf = FacadePdf::loadView('pdf.products', compact('products', 'store'))->setPaper('a4');

        return $pdf;
    }

    public function getExcelDownload(Request $request)
    {
        $fileName = 'product_' . now()->format('Ymd_His') . '.xlsx';
        return Excel::download(new ProductsExport, $fileName);
    }

    public function getSummary(string $range = 'month', ?string $startDate = null, ?string $endDate = null)
    {
        $query = Product::authorized();

        // Define the time range
        switch ($range) {
            case 'today':
                $start = Carbon::today();
                $end = Carbon::tomorrow();
                $format = 'H:i';
                break;
            case 'week':
                $start = Carbon::now()->subDays(6)->startOfDay();
                $end = Carbon::now()->endOfDay();
                $format = 'l';
                break;
            case 'month':
                $start = Carbon::now()->startOfMonth();
                $end = Carbon::now()->endOfMonth();
                $format = 'd';
                break;
            case 'year':
                $start = Carbon::now()->startOfYear();
                $end = Carbon::now()->endOfYear();
                $format = 'F';
                break;
            case 'custom':
                if ($startDate && $endDate) {
                    $start = Carbon::parse($startDate)->startOfDay();
                    $end = Carbon::parse($endDate)->endOfDay();
                    $format = 'd M';
                } else {
                    throw new \InvalidArgumentException("Custom date range requires both start_date and end_date parameters");
                }
                break;
            default:
                throw new \InvalidArgumentException("Invalid date range: $range");
        }

        // Fetch all products with their current stocks (not filtered by date)
        $products = $query->with('stocks')->get();

        // Calculate dashboard metrics
        $totalProducts = $products->count();
        
        $totalBuyingValue = 0;
        $outOfStock = 0;
        $totalValue = 0;

        foreach ($products as $product) {
            $totalStockQty = $product->stocks->sum('qty');
            
            // Calculate selling value (discounted price)
            $productValue = $product->stocks->sum(function ($stock) {
                // Calculate discounted price: price - discount_amount
                $discountedPrice = $stock->price - $stock->discount_amount;
                return $discountedPrice * $stock->qty;
            });
            
            // Calculate buying value
            $productBuyingValue = $product->stocks->sum(function ($stock) {
                return $stock->buying_price * $stock->qty;
            });
            
            $totalValue += $productValue;
            $totalBuyingValue += $productBuyingValue;
            
            if ($totalStockQty == 0) {
                $outOfStock++;
            }
        }

        // Fetch and group historical data for charts based on stocks' created_at
        $histories = $query->with([
            'stocks' => function ($query) use ($start, $end) {
                $query->whereBetween('created_at', [$start, $end]);
            }
        ])->get();

        $grouped = $histories
            ->groupBy(fn($item) => $item->stocks->isNotEmpty()
                ? $item->stocks->first()->created_at->format($format)
                : '')
            ->filter(fn($group) => $group->isNotEmpty())
            ->map(fn($group) => [
                'qty' => $group->sum(fn($item) => $item->stocks->sum('qty')),
                'buyingValue' => $group->sum(fn($item) => $item->stocks->sum(fn($stock) => $stock->buying_price * $stock->qty)),
                'sellingValue' => $group->sum(fn($item) => $item->stocks->sum(fn($stock) => $stock->price * $stock->qty)),
            ]);

        // Total historical summary
        $totalQty = $grouped->sum('qty');
        $totalBuyingValueHistorical = $grouped->sum('buyingValue');
        $totalSellingValue = $grouped->sum('sellingValue');

        // Final structured response with both dashboard metrics and chart data
        return [
            // Dashboard metrics
            'totalProducts' => $totalProducts,
            'totalBuyingValue' => $totalBuyingValue,
            'outOfStock' => $outOfStock,
            'totalValue' => $totalValue,
            // Historical data for charts
            'qty' => $totalQty,
            'buyingValue' => $totalBuyingValueHistorical,
            'sellingValue' => $totalSellingValue,
            'chartSeries' => $grouped->toArray(),
        ];
    }
}
