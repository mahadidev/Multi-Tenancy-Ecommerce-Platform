<?php

namespace App\Modules\Authentication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\StoreManagement\Resources\StoreResource;
use App\Modules\UserManagement\Resources\UserResource;
use App\Modules\Authentication\Services\AuthenticationService;
use App\Modules\Authentication\Requests\LoginRequest;
use App\Modules\Authentication\Requests\RegisterRequest;
use App\Modules\Authentication\Requests\ResetPasswordRequest;
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
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    protected AuthenticationService $authService;

    public function __construct(AuthenticationService $authService)
    {
        $this->authService = $authService;
    }

    public function sellerLogin(LoginRequest $request)
    {
        return $this->authService->authenticateSeller($request);
    }

    public function sellerRegister(RegisterRequest $request)
    {
        return $this->authService->registerSeller($request);
    }

    public function userLogin(LoginRequest $request)
    {
        return $this->authService->authenticateUser($request);
    }

    public function userRegister(RegisterRequest $request)
    {
        return $this->authService->registerUser($request);
    }

    public function logout(Request $request)
    {
        return $this->authService->logout();
    }

    public function sendResetLinkEmail(Request $request)
    {
        return $this->authService->sendPasswordResetLink($request);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        return $this->authService->resetPassword($request);
    }

    public function verifyEmail(Request $request)
    {
        return $this->authService->verifyEmail($request);
    }

    public function resendVerificationEmail(Request $request)
    {
        return $this->authService->resendVerificationEmail($request);
    }
}