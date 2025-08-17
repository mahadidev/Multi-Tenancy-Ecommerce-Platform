<?php

namespace App\Modules\Authentication\Services;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Main Authentication Service - Acts as a facade coordinating specialized authentication services
 * 
 * This service delegates to specialized services for better separation of concerns:
 * - LoginService: Handles user/seller authentication and logout
 * - RegistrationService: Handles user/seller registration
 * - PasswordResetService: Handles password reset functionality
 * - EmailVerificationService: Handles email verification
 * - SessionService: Handles session and store management
 */
class AuthenticationService
{
    protected LoginService $loginService;
    protected RegistrationService $registrationService;
    protected PasswordResetService $passwordResetService;
    protected EmailVerificationService $emailVerificationService;
    protected SessionService $sessionService;

    public function __construct(
        LoginService $loginService,
        RegistrationService $registrationService,
        PasswordResetService $passwordResetService,
        EmailVerificationService $emailVerificationService,
        SessionService $sessionService
    ) {
        $this->loginService = $loginService;
        $this->registrationService = $registrationService;
        $this->passwordResetService = $passwordResetService;
        $this->emailVerificationService = $emailVerificationService;
        $this->sessionService = $sessionService;
    }

    // Login Methods
    public function authenticateSeller(Request $request): JsonResponse
    {
        return $this->loginService->authenticateSeller($request);
    }

    public function authenticateUser(Request $request): JsonResponse
    {
        return $this->loginService->authenticateUser($request);
    }

    public function logout(): JsonResponse
    {
        return $this->loginService->logout();
    }

    // Registration Methods
    public function registerSeller(Request $request): JsonResponse
    {
        return $this->registrationService->registerSeller($request);
    }

    public function registerUser(Request $request): JsonResponse
    {
        return $this->registrationService->registerUser($request);
    }

    // Password Reset Methods
    public function sendPasswordResetLink(Request $request): JsonResponse
    {
        return $this->passwordResetService->sendPasswordResetLink($request);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        return $this->passwordResetService->resetPassword($request);
    }

    // Email Verification Methods
    public function verifyEmail(Request $request): JsonResponse
    {
        return $this->emailVerificationService->verifyEmail($request);
    }

    public function resendVerificationEmail(Request $request): JsonResponse
    {
        return $this->emailVerificationService->resendVerificationEmail($request);
    }
}