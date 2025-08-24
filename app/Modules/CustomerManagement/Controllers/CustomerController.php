<?php

namespace App\Modules\CustomerManagement\Controllers;

use App\Exports\CustomersExport;
// use App\Http\Controllers\Controller;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Modules\UserManagement\Models\User;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\CustomerManagement\Resources\CustomerProfileResource;
use App\Modules\CustomerManagement\Services\CustomerProfileService;
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
    protected CustomerProfileService $profileService;

    public function __construct(CustomerProfileService $profileService)
    {
        $this->profileService = $profileService;
        // $this->middleware('permission:view_customer', ['only' => ['index', 'show', 'pdf', 'excel']]);
        // $this->middleware('permission:create_customer', ['only' => ['store']]);
        // $this->middleware('permission:edit_customer', ['only' => ['update']]);
        // $this->middleware('permission:delete_customer', ['only' => ['destroy']]);
    }

    public function index(Request $request)
    {
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort'); // Sort order, default is 'desc'
        $perPage = $request->input('per_page'); // Items per page, default is 10
        $currentStoreId = authStore();

        $customers = User::whereJsonContains('store_id', $currentStoreId)
            ->with(['customerProfiles' => function($query) use ($currentStoreId) {
                $query->where('store_id', $currentStoreId);
            }])
            ->when($search, function ($query, $search) use ($currentStoreId) {
                $query->where(function($q) use ($search, $currentStoreId) {
                    // Search in user name
                    $q->where('name', 'like', '%' . $search . '%')
                      // Or search in store-specific display name
                      ->orWhereHas('customerProfiles', function($profileQuery) use ($search, $currentStoreId) {
                          $profileQuery->where('store_id', $currentStoreId)
                                      ->where('display_name', 'like', '%' . $search . '%');
                      });
                });
            })
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $customers->paginate($perPage) : $customers->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'customers' => CustomerProfileResource::collection($paginated),
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
            'phone' => 'nullable|string',
            'password' => 'nullable|string',
            'address' => 'nullable|string',
            'image' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $currentStoreId = authStore();
        $password = $request->password ?? '123'; // Default password
        $passwordProvided = !empty($request->password);
        
        // Check if user exists
        $user = User::where('email', $request->email)->first();
        
        if ($user) {
            // Check if already customer of this store
            if ($user->hasProfileInStore($currentStoreId)) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Customer already exists in this store',
                ], 400);
            }
            
            // Add user to store
            $storeIds = $user->store_id ?? [];
            if (!in_array($currentStoreId, $storeIds)) {
                $storeIds[] = $currentStoreId;
                $user->update(['store_id' => $storeIds]);
            }
            
            // Create store-specific profile using service
            $this->profileService->updateProfile($user, $currentStoreId, [
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
                'notes' => $request->notes,
            ]);
            
            // Set store-specific password if provided
            if ($passwordProvided) {
                $this->profileService->setStorePassword($user, $currentStoreId, $password);
            }
            
        } else {
            // Create new user
            $verificationCode = Str::random(40);
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($password),
                'store_id' => [$currentStoreId],
                'address' => $request->address,
                'image' => $request->image,
                'verification_code' => $verificationCode,
                'email_verified_at' => null,
            ]);
            
            // Create profile using service
            $this->profileService->updateProfile($user, $currentStoreId, [
                'notes' => $request->notes,
            ]);
        }

        $this->sendWelcomeEmail($user, Store::find(authStore()), $password);

        return response()->json([
            'status' => 200,
            'message' => 'Customer created successfully',
            'date' => [
                'customer' => new CustomerProfileResource($user),
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
                'customer' => new CustomerProfileResource($customer),
            ],
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'password' => 'nullable|string',
            'address' => 'nullable|string',
            'image' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:active,inactive,blocked',
        ]);

        $currentStoreId = authStore();
        $customer = User::whereJsonContains('store_id', $currentStoreId)->findOrFail($id);
        
        // Update store-specific data using service
        $this->profileService->updateProfile($customer, $currentStoreId, [
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'notes' => $request->notes,
            'status' => $request->status ?? 'active',
        ]);

        // Update store-specific password if provided
        if (!empty($request->password)) {
            $this->profileService->setStorePassword($customer, $currentStoreId, $request->password);
        }

        // Update global user data only if needed
        if ($request->has('image')) {
            $customer->update(['image' => $request->image]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Customer updated successfully',
            'data' => [
                'customer' => new CustomerProfileResource($customer),
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