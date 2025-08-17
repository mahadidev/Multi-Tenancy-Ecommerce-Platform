<?php

namespace App\Modules\Authentication\Services;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Store;
use Illuminate\Support\Str;
use App\Mail\VerifyEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class EmailVerificationService
{
    public function verifyEmail(Request $request): JsonResponse
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
            'verification_code' => null,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Email verified successfully',
        ], 200);
    }

    public function resendVerificationEmail(Request $request): JsonResponse
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

    public function sendVerificationEmail(User $user, int $storeId = null): JsonResponse
    {
        $userName = $user->name;
        $storeName = null;

        if (!is_null($storeId)) {
            $store = Store::find($storeId);
            $storeName = $store->name;
            $verificationUrl = url('/user/verify-email?token=' . $user->verification_code);
        } else {
            $verificationUrl = url('/seller/verify-email?token=' . $user->verification_code);
        }

        try {
            if (env('APP_ENV') == 'production' || env('APP_ENV') == 'local') {
                Mail::to($user->email)->send(new VerifyEmail($verificationUrl, $userName, $storeName));
                return response()->json([
                    'status' => 200,
                    'message' => 'Verification email sent successfully',
                ], 200);
            } else {
                Log::info('Please set APP_ENV to production to send emails');
            }
        } catch (\Throwable $th) {
            Log::info('Error sending verification email: ' . $th->getMessage());
            return $this->errorResponse('Error sending verification email', 500);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Verification email sent successfully',
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