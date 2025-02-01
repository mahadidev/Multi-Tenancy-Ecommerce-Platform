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
        $sort = $request->input('sort'); // Sort order, default is 'desc'
        $perPage = $request->input('per_page'); // Items per page, default is 10

        $customers = User::whereJsonContains('store_id', authStore())
            ->when($search, function ($query, $search) {
                $query
                    ->where('name', 'like', '%' . $search . '%');
            })
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $customers->paginate($perPage) : $customers->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'customers' => CustomerResource::collection($paginated),
            ],
        ];

        // Add pagination meta data if `per_page` is provided
        if ($perPage) {
            $response['meta'] = [
                'current_page' => $paginated->currentPage(),
                'first_page_url' => $paginated->url(1),
                'last_page' => $paginated->lastPage(),
                'last_page_url' => $paginated->url($paginated->lastPage()),
                'next_page_url' => $paginated->nextPageUrl(),
                'prev_page_url' => $paginated->previousPageUrl(),
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
            ];
        }

        return response()->json($response, 200);
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
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to export brands',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
