<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\StoreSubscription;
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
                ->setRedirectUrl(route('uddoktapay.success')) // need to test in server
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
     * Handle successful payment.
     */
    public function success(Request $request)
    {
        $invoiceId = $request->input('invoice_id');

        try {

            $response = $this->uddoktapay->verify($request);
            $store = getStore();
            $responseData = $response->toArray();
            $payment = Payment::where('transaction_id', $responseData['metadata']['transaction_id'])->first();
            $package = Subscription::find($payment->payable_id);

            if ($response->success() || $response->pending()) {
                if ($payment) {
                    $payment->update([
                        'transaction_id' => $responseData['transaction_id'],
                        'status' => 'complete',
                        'invoice_id' => $invoiceId,
                    ]);

                    $store->storeSubscription()->update([
                        'subscription_id' => $package->id,
                        'start_date' => now(),
                        'end_date' => now()->addDays($package->trial_days),
                        'is_active' => true,
                    ]);
                }


                return redirect()->to(url('seller/subscription-success'));

            } else {

                if ($payment) {
                    $payment->update([
                        'transaction_id' => $responseData['transaction_id'],
                        'status' => 'failed',
                        'invoice_id' => $invoiceId,
                    ]);
                }

                // Payment verification failed.
                return redirect()->to(url('seller/subscription-failed'));
            }


        } catch (\UddoktaPay\LaravelSDK\Exceptions\UddoktaPayException $e) {
            Log::info(['message' => 'Verification Error: ' . $e->getMessage()]);
            return redirect()->to(url('seller/subscription-cancelled'));

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
     * Handle IPN (Instant Payment Notification).
     */
    public function webhook(Request $request)
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
}
