<?php

namespace App\Modules\CustomerManagement\Controllers;

use App\Exports\CustomersExport;
// use App\Http\Controllers\Controller;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Modules\UserManagement\Models\User;
use App\Modules\StoreManagement\Models\Store;
use App\Http\Resources\CustomerResource;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Mail\WelcomeCustomerMail;
use App\Mail\VerifyEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Permission\Exceptions\UnauthorizedException;

class CustomerController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('permission:view_customer', ['only' => ['index', 'show', 'pdf', 'excel']]);
    //     $this->middleware('permission:create_customer', ['only' => ['store']]);
    //     $this->middleware('permission:edit_customer', ['only' => ['update']]);
    //     $this->middleware('permission:delete_customer', ['only' => ['destroy']]);
    // }

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

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|numeric',
            'password' => 'nullable|string',
            'address' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $password = false;
        $user = User::where('email', $request->email)->first();
        if ($user) {
            if (is_array($user->store_id) && in_array(authStore(), $user->store_id)) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Customer already exists in this store',
                ], 400);
            } else {
                if (!$user->hasRole('user')) {
                    $roleName = $request->input('role', 'user');
                    $role = Role::firstOrCreate(['name' => $roleName]);
                    $user->assignRole($role->name);
                }
                $storeIds = $user->store_id ?? [];
                $storeIds[] = authStore();
                $password = true;
                $user->update([
                    'store_id' => $storeIds,
                    // 'address' => $request->address,
                    // 'image' => $request->image,
                    // 'phone' => $request->phone,
                ]);
            }
        } else {
            $verificationCode = Str::random(40); // Generate a random verification code
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password) ?? Hash::make('123'), // Default password is 123
                'store_id' => [authStore()],
                'address' => $request->address,
                'image' => $request->image,
                'verification_code' => $verificationCode,
                'email_verified_at' => null,
            ]);
        }

        $this->sendWelcomeEmail($user, Store::find(authStore()), $password);

        return response()->json([
            'status' => 200,
            'message' => 'Customer created successfully',
            'date' => [
                'customer' => new CustomerResource($user),
            ]
        ], 200);
    }

    public function sendWelcomeEmail($user, $store, $password = false)
    {
        try {
            if (env('APP_ENV') == 'production' || env('APP_ENV') == 'local') {
                $appUrl = config('app.url');

                // Ensure we have a trailing slash
                if (!str_ends_with($appUrl, '/')) {
                    $appUrl .= '/';
                }

                // Get store logo URL
                $logoUrl = null;
                if ($store->logo) {
                    $logoUrl = $appUrl . 'storage/' . $store->logo;
                } else {
                    $logoUrl = $appUrl . 'images/logo-text.png';
                }

                // Get domain
                $domain = null;
                if (env('APP_URL') == 'http://127.0.0.1:8000') {
                    $domain = 'http://127.0.0.1:8000/site/login';
                } else {
                    $domain = 'https://' . parse_url(env('APP_URL'), PHP_URL_HOST) . '/site/login';
                }
                $verificationUrl = url('/site/verify-email?token=' . $user->verification_code);

                if ($user && $user->email) {
                    Mail::to($user->email)->send(new WelcomeCustomerMail($user, $store, $logoUrl, $domain, $password));
                    if ($user->email_verified_at == null) {
                        Mail::to($user->email)->send(new VerifyEmail($verificationUrl, $user->name, $store->name));
                    }
                    return true;
                } else {
                    Log::info('Customer email not found');
                }
            } else {
                Log::info('Please set APP_ENV to production to send emails');
            }
        } catch (\Exception $e) {
            Log::error('Error sending welcome email: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $customer = User::whereJsonContains('store_id', authStore())->find($id);

        if (!$customer) {
            return response()->json([
                'status' => 404,
                'message' => 'Customer not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'customer' => new CustomerResource($customer),
            ],
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'nullable|numeric',
            'password' => 'nullable|string',
            'address' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $customer = User::whereJsonContains('store_id', authStore())->find($id);

        if (!$customer) {
            return response()->json([
                'status' => 404,
                'message' => 'Customer not found',
            ], 404);
        }

        $customer->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password) ?? $customer->password,
            'address' => $request->address,
            'image' => $request->image,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Customer updated successfully',
            'data' => [
                'customer' => new CustomerResource($customer),
            ],
        ], 200);
    }

    public function destroy($id)
    {
        $customer = User::whereJsonContains('store_id', authStore())->find($id);

        if (!$customer) {
            return response()->json([
                'status' => 404,
                'message' => 'Customer not found',
            ], 404);
        }


        // Get the current store_id array
        $storeIds = $customer->store_id;

        // Remove the authenticated store ID from the array
        $updatedStoreIds = array_diff($storeIds, [authStore()]);

        // Update the customer's store_id field
        $customer->store_id = array_values($updatedStoreIds); // Re-index the array
        $customer->save();

        return response()->json([
            'status' => 200,
            'message' => 'Customer deleted successfully',
        ], 200);
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