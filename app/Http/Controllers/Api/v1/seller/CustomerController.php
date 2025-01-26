<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\CustomerResource;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;

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

        $pdf = FacadePdf::loadView('pdf.customers', compact('customers'))->setPaper('a4');

        return $pdf->download('customers_' . now()->format('Ymd_His') . '.pdf');
    }
}
