<?php

namespace App\Services\ProductServices;

use App\Exports\ProductsExport;
use App\Models\Store;
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
}
