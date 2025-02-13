<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StoreSession;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Mail\WelcomeSellerAdmin;
use App\Mail\VerifyEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\Store;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::whereHas('storeSession') // Ensures the user has a store session
            ->with(['roles:name', 'storeSession']) // Load roles and store sessions
            ->latest()
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Seller admins retrieved successfully',
            'data' => [
                'users' => UserResource::collection($users)
            ]
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|string|email|unique:users,email',
            'role_id' => 'required|exists:roles,id',
            'phone' => 'nullable|numeric',
            'address' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $store_id = authStore();

        if (!$store_id) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized, store not found'
            ], 403);
        }

        $role = Role::findById($request->role_id, 'web');
        if ($role->store_id != $store_id) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized, role not found'
            ], 403);
        }

        $verificationCode = Str::random(40); // Generate a random verification code

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('123'),
            'verification_code' => $verificationCode,
            'phone' => $request->phone,
            'address' => $request->address,
            'image' => $request->image,
            'email_verified_at' => null,
        ]);

        $user->assignRole($role);

        StoreSession::create([
            'user_id' => $user->id,
            'store_id' => $store_id
        ]);

        // Fetch the store and role details
        $store = Store::find($store_id);

        $this->sendWelcomeEmail($user, $store, $role);

        return response()->json([
            'status' => 201,
            'message' => 'User created successfully, and assigned to store',
            'data' => [
                'user' => new UserResource($user)
            ]
        ], 201);
    }

    public function sendWelcomeEmail($user, $store, $role)
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
                    $domain = 'http://127.0.0.1:8000/seller/login';
                } else {
                    $domain = 'https://' . parse_url(env('APP_URL'), PHP_URL_HOST) . '/seller/login';
                }
                $verificationUrl = url('/seller/verify-email?token=' . $user->verification_code);

                if ($user && $user->email) {
                    Mail::to($user->email)->send(new WelcomeSellerAdmin($user, $store, $role, $logoUrl, $domain));
                    Mail::to($user->email)->send(new VerifyEmail($verificationUrl, $user->url, $store->name));
                    return true;
                } else {
                    Log::info('User email not found');
                }
            } else {
                Log::info('Please set APP_ENV to production to send emails');
            }
        } catch (\Exception $e) {
            Log::error('Error sending welcome email: ' . $e->getMessage());
            // return response()->json(['status' => 500, 'message' => 'Error sending welcome email'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::whereHas('storeSession') // Ensures the user has a store session
            ->with(['roles:name', 'storeSession']) // Load roles and store sessions
            ->find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Seller admin retrieved successfully',
            'data' => new UserResource($user)
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|string|email',
            'role_id' => 'required|exists:roles,id',
            'password' => 'nullable|string',
            'role_id' => 'required|exists:roles,id',
            'phone' => 'nullable|numeric',
            'address' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ], 404);
        }
        
        $role = Role::findById($request->role_id, 'web');
        if ($role->store_id != authStore()) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized, role not found'
            ], 403);
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
            'phone' => $request->phone ?? null,
            'address' => $request->address ?? null,
            'image' => $request->image ?? null,
        ]);

        $user->syncRoles([$role]);

        return response()->json([
            'status' => 200,
            'message' => 'User updated successfully',
            'data' => new UserResource($user)
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $store_id = authStore();
        if (!$store_id) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized, store not found'
            ], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ], 404);
        }

        if ($user->storeSession()->where('store_id', '!=', $store_id)->count() == 0) {
            if (is_null($user->store_id)) {
                $user->delete();
            }
            else {
                return response()->json([
                    'status' => 403,
                    'message' => 'User cannot be deleted. User is assigned to another store as a customer'
                ], 403);
            }
        } else {
            $user->storeSession()->where('store_id', $store_id)->delete();
        }

        return response()->json([
            'status' => 200,
            'message' => 'User removed from store'
        ], 200);
    }
}
