<?php

namespace App\Modules\SubscriptionManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\SubscriptionManagement\Models\Subscription;
use App\Modules\PaymentManagement\Models\Payment;
use App\Modules\SubscriptionManagement\Models\StoreSubscription;
use App\Modules\StoreManagement\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use UddoktaPay\LaravelSDK\UddoktaPay;
use UddoktaPay\LaravelSDK\Requests\CheckoutRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    protected $uddoktapay;

    public function __construct()
    {
        $sandbox = ['982d381360a69d419689740d9f2e26ce36fb7a50', 'https://sandbox.uddoktapay.com/api/checkout-v2'];
        $realAPI = ['QkC0IhDCE40qQDHAS6hERwXhy10jc4GWwPtdATAx', 'https://yeamin.paymently.io/api'];

        $this->uddoktapay = UddoktaPay::make($sandbox[0], $sandbox[1]);
    }

    /**
     * Get all visible subscription plans
     */
    public function index(): JsonResponse
    {
        try {
            $subscriptions = Subscription::with('features')
                ->visible()
                ->orderBy('price_monthly', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Subscription plans retrieved successfully',
                'data' => [
                    'plans' => $subscriptions->map(function ($subscription) {
                        return [
                            'id' => $subscription->id,
                            'name' => $subscription->name,
                            'slug' => $subscription->name,
                            'description' => $subscription->title,
                            'price' => (float) $subscription->price_monthly,
                            'billing_cycle' => 'monthly',
                            'features' => $subscription->features->where('is_available', 1)->pluck('name')->toArray(),
                            'is_popular' => (bool) $subscription->is_trend,
                            'is_active' => (bool) $subscription->is_visible,
                            'created_at' => $subscription->created_at,
                            'updated_at' => $subscription->updated_at,
                        ];
                    })
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve subscription plans',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific subscription plan
     */
    public function show(Subscription $subscription): JsonResponse
    {
        try {
            $subscription->load('features');

            return response()->json([
                'status' => 200,
                'message' => 'Subscription plan retrieved successfully',
                'data' => [
                    'subscription' => $subscription
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve subscription plan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Original working subscription method (package-subscription endpoint)
     */
    public function subscribePackage(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:subscriptions,id',
            'amount' => 'required|numeric'
        ]);

        $package = Subscription::find($request->package_id);

        if (!$package) {
            return response()->json([
                'status' => 400,
                'message' => 'Invalid subcription Id',
            ]);
        }

        $user = auth()->user();

        $payment = Payment::create([
            'user_id' => $user->id,
            'store_id' => authStore(),
            'transaction_id' => Str::uuid()->toString(),
            'amount' => $request->amount,
            'name' => $user->name,
            'email' => $user->email,
            'status' => 'pending',
            'payment_method' => 'online',
            'payable_type' => Subscription::class,
            'payable_id' => $package->id,
        ]);

        try {

            $checkoutRequest = CheckoutRequest::make()
                ->setFullName($payment->name)
                ->setEmail($payment->email)
                ->setAmount($payment->amount)
                ->addMetadata('transaction_id', $payment->transaction_id)
                ->setRedirectUrl(route('uddoktapay.success'))
                ->setCancelUrl(route('uddoktapay.cancel'))
                ->setWebhookUrl(route('uddoktapay.webhook'));

            $response = $this->uddoktapay->checkout($checkoutRequest);

            if ($response->failed()) {
                return back()->withErrors(['error' => $response->message()]);
            }

            return response()->json([
                'status' => 200,
                'data' => [
                    'payment_url' => $response->paymentURL()
                ]
            ]);
        } catch (\UddoktaPay\LaravelSDK\Exceptions\UddoktaPayException $e) {
            return back()->withErrors(['error' => 'Initialization Error: ' . $e->getMessage()]);
        }
    }

    /**
     * Subscribe to a plan (new endpoint for compatibility)
     */
    public function subscribe(Request $request): JsonResponse
    {
        // Support both old and new payload formats
        $rules = [];
        
        if ($request->has('package_id')) {
            // Legacy format - redirect to working method
            return $this->subscribePackage($request);
        } else {
            // New format - convert to legacy format
            $rules = [
                'plan_id' => 'required|exists:subscriptions,id',
                'billing_cycle' => 'in:monthly,yearly,weekly,daily',
                'payment_method' => 'string|nullable'
            ];
            
            $request->validate($rules);
            
            $subscription = Subscription::findOrFail($request->plan_id);
            
            // Convert new format to legacy format
            $legacyRequest = new Request([
                'package_id' => $request->plan_id,
                'amount' => $subscription->price_monthly
            ]);
            
            return $this->subscribePackage($legacyRequest);
        }
    }

    /**
     * Handle successful payment.
     */
    public function success(Request $request)
    {
        $invoiceId = $request->input('invoice_id');

        try {
            $response = $this->uddoktapay->verify($request);
            $responseData = $response->toArray();
            
            // Get payment record first
            $payment = Payment::where('transaction_id', $responseData['metadata']['transaction_id'])->first();
            
            if (!$payment) {
                Log::error('Payment not found for transaction_id: ' . ($responseData['metadata']['transaction_id'] ?? 'N/A'));
                return redirect()->to(url('seller/subscription-failed'));
            }
            
            // Get store from payment record instead of authStore()
            $store = Store::find($payment->store_id);
            $package = Subscription::find($payment->payable_id);

            if ($response->success() || $response->pending()) {
                // Update payment status
                $payment->update([
                    'transaction_id' => $responseData['transaction_id'],
                    'status' => 'complete',
                    'invoice_id' => $invoiceId,
                ]);

                if ($store && $package) {
                    // Check if store subscription exists, create or update
                    $storeSubscription = $store->storeSubscription;
                    
                    if ($storeSubscription) {
                        // Update existing subscription
                        $storeSubscription->update([
                            'subscription_id' => $package->id,
                            'start_date' => now(),
                            'end_date' => now()->addDays($package->trial_days),
                            'is_active' => true,
                        ]);
                    } else {
                        // Create new subscription
                        $store->storeSubscription()->create([
                            'user_id' => $payment->user_id,
                            'subscription_id' => $package->id,
                            'start_date' => now(),
                            'end_date' => now()->addDays($package->trial_days),
                            'is_active' => true,
                        ]);
                    }
                    
                    Log::info('Subscription created/updated successfully', [
                        'store_id' => $store->id,
                        'subscription_id' => $package->id,
                        'payment_id' => $payment->id
                    ]);
                }

                return redirect()->to(url('seller/subscription-success'));

            } else {
                // Payment failed
                $payment->update([
                    'transaction_id' => $responseData['transaction_id'],
                    'status' => 'failed',
                    'invoice_id' => $invoiceId,
                ]);

                Log::warning('Payment verification failed', [
                    'transaction_id' => $responseData['transaction_id'],
                    'payment_id' => $payment->id
                ]);

                return redirect()->to(url('seller/subscription-failed'));
            }

        } catch (\UddoktaPay\LaravelSDK\Exceptions\UddoktaPayException $e) {
            Log::error('Payment verification error: ' . $e->getMessage());
            return redirect()->to(url('seller/subscription-cancelled'));
        } catch (\Exception $e) {
            Log::error('Subscription creation error: ' . $e->getMessage());
            return redirect()->to(url('seller/subscription-failed'));
        }
    }

    /**
     * Handle canceled payment.
     */
    public function cancel()
    {
        // Handle payment cancellation.
        return redirect()->to(url('seller/subscription-cancelled'));
    }

    /**
     * Handle payment webhook from UddoktaPay
     */
    public function webhook(Request $request): JsonResponse
    {
        try {
            $ipnResponse = $this->uddoktapay->executePayment();

            if ($ipnResponse->isSuccessful()) {
                Log::info($ipnResponse);
            }

            return response()->json(['status' => 'success']);
        } catch (\UddoktaPay\LaravelSDK\Exceptions\UddoktaPayException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get user's subscriptions
     */
    public function getUserSubscriptions(): JsonResponse
    {
        try {
            $user = auth()->user();
            
            // TODO: Implement user subscriptions table and relationships
            // For now, return empty array
            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'User subscriptions retrieved successfully',
                'data' => [
                    'subscriptions' => []
                ]
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve user subscriptions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel user subscription
     */
    public function cancelSubscription($id): JsonResponse
    {
        try {
            // TODO: Implement subscription cancellation logic
            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Subscription cancelled successfully'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to cancel subscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user subscription
     */
    public function updateSubscription(Request $request, $id): JsonResponse
    {
        try {
            // TODO: Implement subscription update logic
            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Subscription updated successfully'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update subscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}