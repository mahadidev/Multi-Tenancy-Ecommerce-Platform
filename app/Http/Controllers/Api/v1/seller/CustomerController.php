<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Exports\CustomersExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Store;
use App\Http\Resources\CustomerResource;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;


class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort', 'desc'); // Sort order, default is 'desc'
        $perPage = $request->input('per_page', 10); // Items per page, default is 10

        $customers = User::whereJsonContains('store_id', authStore())
            ->when($search, function ($query, $search) {
                $query
                    ->where('name', 'like', '%' . $search . '%');
            })
            ->orderBy('created_at', $sort) // Sort by 'created_at' in the specified order
            ->paginate($perPage);

        return response()->json(
            [
                'status' => 200,
                'message' => 'Customers fetched successfully',
                'data' => [
                    'customers' => CustomerResource::collection($customers),
                ],
                'meta' => [
                    'current_page' => $customers->currentPage(),
                    'first_page_url' => $customers->url(1),
                    'last_page' => $customers->lastPage(),
                    'last_page_url' => $customers->url($customers->lastPage()),
                    'next_page_url' => $customers->nextPageUrl(),
                    'prev_page_url' => $customers->previousPageUrl(),
                    'total' => $customers->total(),
                    'per_page' => $customers->perPage(),
                ],
            ],
            200,
        );
    }

    public function pdf(Request $request)
    {
        $customers = User::whereJsonContains('store_id', authStore())->get();
        $store = Store::select('id', 'logo', 'name', 'phone', 'domain', 'location', 'email', 'currency')->find(authStore());
        $store->domain = $store->domain();

        $pdf = FacadePdf::loadView('pdf.customers', compact('customers', 'store'))->setPaper('a4');

        return $pdf->download('customers_' . now()->format('Ymd_His') . '.pdf');
    }

    public function excel(Request $request)
    {
        try {
            $fileName = 'customers_' . now()->format('Ymd_His') . '.xlsx';

            return Excel::download(new CustomersExport, $fileName); 
            
            // // Check if the request wants to force download
            // if ($request->has('download')) {
            //     return Excel::download(new CustomersExport, $fileName);
            // }

            // // Store the file temporarily and return a response with file info
            // Excel::store(new CustomersExport, 'temp/' . $fileName, 'public');

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
                'message' => 'Failed to export brands',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
