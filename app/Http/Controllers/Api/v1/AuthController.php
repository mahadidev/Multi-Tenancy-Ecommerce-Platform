<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Store;
use App\Models\StoreSession;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmail;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;


class AuthController extends Controller
{
    public function sellerLogin(Request $request)
    {
        $request->validate([
            'email' => 'string|required',
            'password' => 'required',
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        // Check if the user exists and the password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(
                [
                    'message' => 'Invalid email or password.',
                ],
                401,
            );
        }

        // Check if the user has the role of 'seller'
        if (!$user->hasRole('seller')) {
            return response()->json(
                [
                    'message' => 'Unauthorized. Only sellers can log in.',
                ],
                403,
            );
        }

        // update or create store_id in the Store Session table
        $storeSession = $user->storeSession()->first();
        $store = null;

        if ($storeSession) {
            // remove previous store id from session
            $request->session()->forget('store_id');
            if (session()->has('store_id')) {
                session()->forget('store_id');
            }

            // store the store id in session
            session(['store_id' => $storeSession->id]);

            // Also set it in the request attributes
            $request->attributes->set('store_id', $storeSession->store_id);

            // find the store
            $store = Store::find($storeSession->store_id);
        }

        if (!$storeSession) {
            $store = Store::where('owner_id', $user->id)->first();

            if ($store) {
                StoreSession::updateOrCreate(
                    [
                        'user_id' => $user->id,
                    ],
                    [
                        'store_id' => $store->id,
                    ],
                );

                $request->session()->forget('store_id');
                if (session()->has('store_id')) {
                    session()->forget('store_id');
                }

                // store the store id in session
                session(['store_id' => $store->id]);

                // Also set it in the request attributes
                $request->attributes->set('store_id', $store->id);
            }
        }

        // Generate a Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = [
            'status' => 200,
            'message' => 'login success',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user),
                'membership' => null,
            ],
        ];

        if ($store) {
            $response['data']['logged_store'] = new StoreResource($store);
        }

        // return all stores
        $stores = Store::where(['owner_id' => $user->id])->get();
        if ($stores) {
            $response['data']['stores'] = StoreResource::collection($stores);
        }

        // Return the token and user details
        return response()->json($response, 200);
    }

    public function sellerRegister(Request $request)
    {
        $verificationCode = Str::random(40); // Generate a random verification code

        $request->validate([
            'name' => 'required',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verification_code' => $verificationCode, // Store the verification code
            'email_verified_at' => null, // Ensure the email is not verified yet
        ]);

        // Assign role to the seller
        $roleName = $request->input('role', 'seller'); // Default to 'seller' if no role is provided
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->assignRole($role->name);

        // Send verification email
        $this->sendVerificationEmail($user);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(
            [
                'status' => 200,
                'message' => 'Signup successful, verification email sent, please verify your email',
                'data' => [
                    'token_type' => 'Bearer',
                    'access_token' => $token,
                    'user' => new UserResource($user),
                ],
            ],
            200,
        );
    }

    public function userLogin(Request $request)
    {
        $request->validate([
            'email' => 'string|required',
            'password' => 'required',
        ]);

        if (!$request->has('store_id')) {
            return $this->errorResponse('Store ID is not found', 404);
        }

        $store = Store::find($request->input('store_id'));

        if (!$store) {
            return $this->errorResponse('Invalid store id', 404);
        }

        // Find the user by email and add the store in the user table
        $user = User::where('email', $request->email)->where('email_verified_at', '!=', null)->first();

        // Check if user exists, password matches, and the user has the 'user' role
        if (!$user || !Hash::check($request->password, $user->password) || !$user->hasRole('user')) {
            $message = !$user || !Hash::check($request->password, $user->password) ? 'Invalid email or password' : 'Unauthorized. Only customers can log in.';

            $statusCode = !$user || !Hash::check($request->password, $user->password) ? 401 : 403;

            return $this->errorResponse($message, $statusCode);
        }

        // Check if 'store_id' is null or if the store ID doesn't exist in the array for users table
        $storeId = $store->id;
        if (is_null($user->store_id) || !in_array($storeId, $user->store_id)) {
            return $this->errorResponse('This store is not associated with the user, please sign-up', 404);
        }

        // Generate a Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        //add store_id in the session
        session(['site_store_id' => $store->id]); // Store the new `store_id` in the session
        $request->attributes->set('site_store_id', $store->id); // Also set it in the request attributes

        // Return the token and user details
        return response()->json([
            'status' => 200,
            'message' => 'login success',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'store' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'domain' => $store->domain,
                ],
            ],
        ], 200);
    }

    public function userRegister(Request $request)
    {
        $this->validateRegistrationRequest($request);

        $storeId = (int) $request->store_id;
        $email = $request->email;

        // Check for existing user with same email and store
        if ($this->userExistsInStore($email, $storeId)) {
            return $this->errorResponse('Email already registered for this store', 400);
        }

        // Try to find user with same email in different store
        $existingUser = $this->findUserInDifferentStore($email, $storeId);

        if ($existingUser) {
            return $this->handleExistingUserRegistration($existingUser, $storeId, $request);
        }

        return $this->createNewUser($request, $storeId);
    }

    private function validateRegistrationRequest(Request $request)
    {
        return $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email',
            'password' => 'required|string',
            'confirm_password' => 'required|string|same:password',
            'store_id' => 'required|exists:stores,id,deleted_at,NULL', // Check for non-deleted stores
        ]);
    }

    private function userExistsInStore(string $email, int $storeId): bool
    {
        return User::where('email', $email)->whereJsonContains('store_id', $storeId)->exists();
    }

    private function findUserInDifferentStore(string $email, int $storeId)
    {
        return User::where('email', $email)
            ->where(function ($query) use ($storeId) {
                $query->whereJsonDoesntContain('store_id', $storeId)
                    ->orWhereNull('store_id');
            })
            ->first();
    }

    private function createNewUser(Request $request, int $storeId)
    {
        $verificationCode = Str::random(40); // Generate a random verification code

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'store_id' => [$storeId],
            'verification_code' => $verificationCode, // Store the verification code
            'email_verified_at' => null, // Ensure the email is not verified yet
        ]);

        $roleName = $request->input('role', 'user');
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->assignRole($role->name);

        if ($storeId) {
            $this->storeSessionData($request, $storeId);
        }
        // Send verification email
        $this->sendVerificationEmail($user, $storeId);

        return response()->json([
            'status' => 200,
            'message' => 'Signup successful, verification email sent, please verify your email',
            'data' => [
                'user' => new UserResource($user)
            ],
        ], 200);
    }

    private function handleExistingUserRegistration(User $user, int $storeId, Request $request)
    {
        $storeIds = $user->store_id ?? [];
        $storeIds[] = $storeId;

        // check if the user has the role of 'user'
        if (!$user->hasRole('user')) {
            $roleName = $request->input('role', 'user');
            $role = Role::firstOrCreate(['name' => $roleName]);
            $user->assignRole($role->name);
        }
        $user->update(['store_id' => $storeIds]);

        return $this->generateSuccessResponse($user, $request, $storeId);
    }

    private function generateSuccessResponse(User $user, Request $request, int $storeId = null)
    {
        $token = $user->createToken('auth_token')->plainTextToken;

        if ($storeId) {
            $this->storeSessionData($request, $storeId);
        }

        return response()->json(
            [
                'status' => 200,
                'message' => 'Signup successful',
                'data' => [
                    'token_type' => 'Bearer',
                    'access_token' => $token,
                    'user' => new UserResource($user),
                ],
            ],
            200,
        );
    }

    private function storeSessionData(Request $request, int $storeId): void
    {
        if (session()->has('site_store_id')) {
            session()->forget('site_store_id');
        }

        session(['site_store_id' => $storeId]);
        $request->attributes->set('site_store_id', $storeId);
    }

    private function errorResponse(string $message, int $status)
    {
        return response()->json(
            [
                'status' => $status,
                'message' => $message,
                'data' => null,
            ],
            $status,
        );
    }

    public function logout(Request $request)
    {
        $user = auth()->user();
        if ($user) {
            $user->tokens()->delete();
            session()->flush();
            return response()->json([
                'status' => 200,
                'message' => 'Logout successful',
            ]);
        }
        return $this->errorResponse('User is not authenticated', 400);
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Find the user
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid email!',
            ]);
        }

        $stackHolder = $user->hasRole('seller') ? 'seller' : 'user';

        // Generate a reset token
        $token = Password::createToken($user);

        // Create the reset URL
        $resetUrl = url('/' . $stackHolder . '/reset-password?email=' . urlencode($user->email) . '&token=' . $token);

        // Send the email
        try {
            Mail::to($user->email)->send(new ResetPasswordMail($resetUrl, $user->name));

            return response()->json([
                'status' => 200,
                'message' => 'Reset password email sent successfully!',
            ]);
        } catch (\Throwable $th) {

            return response()->json([
                'status' => 500,
                'message' => 'Internal Error!',
            ]);
        }
    }

    public function resetPassword(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'status' => 422,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ],
                422,
            );
        }

        // Verify the token using Laravel's Password Broker
        $user = \App\Models\User::where('email', $request->email)->first();

        if (!Password::tokenExists($user, $request->token)) {
            return response()->json(
                [
                    'status' => 403,
                    'message' => 'Invalid or expired token.',
                ],
                403,
            );
        }

        // Token is valid; reset the password
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Optionally, delete the token after successful password reset
        Password::deleteToken($user);

        return response()->json(
            [
                'status' => 200,
                'message' => 'Password has been reset successfully.',
            ],
            200,
        );
    }

    private function sendVerificationEmail(User $user, int $storeId = null)
    {
        $userName = $user->name;
        if (!is_null($storeId)) {
            $store = Store::find($storeId);
            $storeName = $store->name;
            $verificationUrl = url('/user/verify-email?token=' . $user->verification_code);
        } else {
            $verificationUrl = url('/seller/verify-email?token=' . $user->verification_code);
        }

        try {
            if (env('APP_ENV') == 'production' || env('APP_ENV') == 'local') {

                Mail::to($user->email)->send(new VerifyEmail($verificationUrl, $userName, $storeName ?? null));
                return response()->json([
                    'status' => 200,
                    'message' => 'Verification email sent successfully',
                ], 200);
            } else {
                Log::info('Please set APP_ENV to production to send emails');
            }
        } catch (\Throwable $th) {
            //throw $th;
            Log::info('Error sending verification email: ' . $th->getMessage());
            return $this->errorResponse('Error sending verification email', 500);
        }
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'token' => 'required',
        ]);

        $user = User::where('verification_code', $request->token)->first();

        if (!$user) {
            return $this->errorResponse('Invalid verification code', 404);
        }

        $user->update([
            'email_verified_at' => now(),
            'verification_code' => null, // Clear the verification code
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Email verified successfully',
        ], 200);
    }

    public function resendVerificationEmail(Request $request)
    {
        $user = auth()->user();

        $verification_code = Str::random(40);
        $user->update(['verification_code' => $verification_code]);

        if (!$user) {
            return $this->errorResponse('User not authenticated', 401);
        }

        if ($user->email_verified_at) {
            return $this->errorResponse('Email already verified', 400);
        }

        if ($request->login_type == 'user') {
            // get store id from the site store id session
            $store_id = session()->get('site_store_id');
            $this->sendVerificationEmail($user, $store_id);
        } else {
            $this->sendVerificationEmail($user);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Verification email sent successfully',
        ]);
    }
}
