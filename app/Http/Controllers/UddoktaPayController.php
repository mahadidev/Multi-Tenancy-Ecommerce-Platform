<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use UddoktaPay\LaravelSDK\UddoktaPay;
use UddoktaPay\LaravelSDK\Requests\CheckoutRequest;

class UddoktaPayController extends Controller
{
    protected $uddoktapay;

    public function __construct()
    {
        $this->uddoktapay = UddoktaPay::make(env('UDDOKTAPAY_API_KEY'), env('UDDOKTAPAY_API_URL'));
    }

    /**
     * Display the payment form.
     */
    public function show()
    {
        return view('uddoktapay.payment-form');
    }

    /**
     * Initiate a payment request.
     */
    public function pay(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email'     => 'required|email|max:255',
            'amount'    => 'required|numeric|min:1',
        ]);

        try {
            $checkoutRequest = CheckoutRequest::make()
                ->setFullName($validated['full_name'])
                ->setEmail($validated['email'])
                ->setAmount($validated['amount'])
                ->addMetadata('order_id', uniqid())
                ->setRedirectUrl(route('uddoktapay.success'))
                ->setCancelUrl(route('uddoktapay.cancel'))
                ->setWebhookUrl(route('uddoktapay.webhook'));

            $response = $this->uddoktapay->checkout($checkoutRequest);

            if ($response->failed()) {
                return back()->withErrors(['error' => $response->message()]);
            }

            return redirect($response->paymentURL());
        } catch (\UddoktaPay\LaravelSDK\Exceptions\UddoktaPayException $e) {
            return back()->withErrors(['error' => "Initialization Error: " . $e->getMessage()]);
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

            if ($response->success()) {
                // Payment was successful; process accordingly.
                return view('uddoktapay.payment-status', ['response' => $response]);
            } else {

                // Payment verification failed.
                return view('uddoktapay.payment-status', ['message' => 'Failed or Canceled']);
            }
        } catch (\UddoktaPay\LaravelSDK\Exceptions\UddoktaPayException $e) {
            return view('uddoktapay.payment-status', ['message' => "Verification Error: " . $e->getMessage()]);
        }
    }

    /**
     * Handle canceled payment.
     */
    public function cancel()
    {
        // Handle payment cancellation.
        return view('uddoktapay.payment-status');
    }

    /**
     * Handle IPN (Instant Payment Notification).
     */
    public function webhook(Request $request)
    {
        try {
            $ipnResponse = $this->uddoktapay->executePayment();

            if ($ipnResponse->isSuccessful()) {
                // Process the IPN response.
                // For example, update the order status in your database.
            }

            return response()->json(['status' => 'success']);
        } catch (\UddoktaPay\LaravelSDK\Exceptions\UddoktaPayException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
