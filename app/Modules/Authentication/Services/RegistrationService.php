<?php

namespace App\Modules\Authentication\Services;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class RegistrationService
{
    protected EmailVerificationService $emailVerificationService;
    protected SessionService $sessionService;

    public function __construct(
        EmailVerificationService $emailVerificationService,
        SessionService $sessionService
    ) {
        $this->emailVerificationService = $emailVerificationService;
        $this->sessionService = $sessionService;
    }

    public function registerSeller(Request $request): JsonResponse
    {
        $verificationCode = Str::random(40);

        $request->validate([
            'name' => 'required',
            'email' => 'required|string|email',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $storeSession = $user->storeSession()->count();
            if ($storeSession > 0) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Email already registered, please register with a different email',
                ], 400);
            }
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verification_code' => $verificationCode,
            'email_verified_at' => null,
        ]);

        // Assign role to the seller
        try {
            // Temporarily skip role assignment
            // $roleName = $request->input('role', 'seller');
            // $user->assignRole($roleName);
        } catch (\Exception $e) {
            // Log the error but don't fail the registration
            \Log::warning('Failed to assign role during registration: ' . $e->getMessage());
            // We'll continue without role assignment - can be assigned later
        }

        // Send verification email
        $this->emailVerificationService->sendVerificationEmail($user);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'Signup successful, verification email sent, please verify your email',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user),
            ],
        ], 200);
    }

    public function registerUser(Request $request): JsonResponse
    {
        $this->validateRegistrationRequest($request);

        $storeId = (int) $request->store_id;
        $email = $request->email;

        if ($this->userExistsInStore($email, $storeId)) {
            return $this->errorResponse('Email already registered for this store', 400);
        }

        $existingUser = $this->findUserInDifferentStore($email, $storeId);

        if ($existingUser) {
            return $this->handleExistingUserRegistration($existingUser, $storeId, $request);
        }

        return $this->createNewUser($request, $storeId);
    }

    private function validateRegistrationRequest(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email',
            'password' => 'required|string',
            'confirm_password' => 'required|string|same:password',
            'store_id' => 'required|exists:stores,id,deleted_at,NULL',
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

    private function createNewUser(Request $request, int $storeId): JsonResponse
    {
        $verificationCode = Str::random(40);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'store_id' => [$storeId],
            'verification_code' => $verificationCode,
            'email_verified_at' => null,
        ]);

        // Temporarily skip role assignment
        // $roleName = $request->input('role', 'user');
        // $user->assignRole($roleName);

        if ($storeId) {
            $this->sessionService->storeSessionData($request, $storeId);
        }

        $this->emailVerificationService->sendVerificationEmail($user, $storeId);

        return response()->json([
            'status' => 200,
            'message' => 'Signup successful, verification email sent, please verify your email',
            'data' => [
                'user' => new UserResource($user)
            ],
        ], 200);
    }

    private function handleExistingUserRegistration(User $user, int $storeId, Request $request): JsonResponse
    {
        $storeIds = $user->store_id ?? [];
        $storeIds[] = $storeId;

        if (!$user->hasRole('user')) {
            // Temporarily skip role assignment
            // $roleName = $request->input('role', 'user');
            // $user->assignRole($roleName);
        }

        $user->update(['store_id' => $storeIds]);

        if ($user->email_verified_at) {
            return $this->generateSuccessResponse($user, $request, $storeId);
        } else {
            $verificationCode = Str::random(40);
            $user->update(['verification_code' => $verificationCode]);
            return $this->emailVerificationService->sendVerificationEmail($user, $storeId);
        }
    }

    private function generateSuccessResponse(User $user, Request $request, $storeId = null): JsonResponse
    {
        if ($storeId) {
            $this->sessionService->storeSessionData($request, $storeId);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Signup successful, Please Login to continue',
            'data' => [
                'user' => new UserResource($user),
            ],
        ], 200);
    }

    private function errorResponse(string $message, int $status): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => null,
        ], $status);
    }
}
