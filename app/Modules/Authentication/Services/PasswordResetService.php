<?php

namespace App\Modules\Authentication\Services;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\JsonResponse;

class PasswordResetService
{
    public function sendPasswordResetLink(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid email!',
            ]);
        }

        $stackHolder = $user->hasRole('seller') ? 'seller' : 'user';
        $token = Password::createToken($user);
        $resetUrl = url('/' . $stackHolder . '/reset-password?email=' . urlencode($user->email) . '&token=' . $token);

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

    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!Password::tokenExists($user, $request->token)) {
            return response()->json([
                'status' => 403,
                'message' => 'Invalid or expired token.',
            ], 403);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        Password::deleteToken($user);

        return response()->json([
            'status' => 200,
            'message' => 'Password has been reset successfully.',
        ], 200);
    }
}