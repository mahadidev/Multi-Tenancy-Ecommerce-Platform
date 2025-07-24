<?php

namespace App\Services\ProductServices;

use App\Exports\ProductsExport;
use App\Models\Product;
use App\Models\Store;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Maatwebsite\Excel\Facades\Excel;

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

    public function getSummary(string $range = 'month')
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
                $format = 'l'; // Monday, Tuesday...
                break;

            case 'month':
                $start = Carbon::now()->startOfMonth();
                $end = Carbon::now()->endOfMonth();
                $format = 'd'; // Day of the month
                break;

            case 'year':
                $start = Carbon::now()->startOfYear();
                $end = Carbon::now()->endOfYear();
                $format = 'F'; // January, February...
                break;

            default:
                throw new \InvalidArgumentException("Invalid date range: $range");
        }

        // Fetch and group data based on stocks' created_at
        $histories = $query->with([
            'stocks' => function ($query) use ($start, $end) {
                // Filter stocks by their created_at date
                $query->whereBetween('created_at', [$start, $end]);
            }
        ])
            ->get()
            ->groupBy(fn($item) => $item->stocks->isNotEmpty() ? $item->stocks->first()->created_at->format($format) : null) // Group by stock's created_at
            ->filter(fn($group) => $group->isNotEmpty()) // Remove any empty groups
            ->map(fn($group) => [
                'qty' => $group->sum(fn($item) => $item->stocks->sum('qty')), // Sum qty for each product
                'buyingValue' => $group->sum(fn($item) => $item->stocks->sum(fn($stock) => $stock->buying_price * $stock->qty)), // Sum value for each product stock,
                'sellingValue' => $group->sum(fn($item) => $item->stocks->sum(fn($stock) => $stock->price * $stock->qty)), // Sum value for each product stock
            ])
            ->toArray();

        return $histories;
    }

}
