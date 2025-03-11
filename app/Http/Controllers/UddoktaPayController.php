<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use UddoktaPay\LaravelSDK\UddoktaPay;
use UddoktaPay\LaravelSDK\Requests\CheckoutRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class UddoktaPayController extends Controller
{
    protected $uddoktapay;

    public function __construct()
    {
        $this->uddoktapay = UddoktaPay::make('982d381360a69d419689740d9f2e26ce36fb7a50', 'https://sandbox.uddoktapay.com/api/checkout-v2');
        // $this->uddoktapay = UddoktaPay::make('QkC0IhDCE40qQDHAS6hERwXhy10jc4GWwPtdATAx', 'https://yeamin.paymently.io/api');
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email'     => 'required|email|max:255',
            'amount'    => 'required|numeric|min:100',
        ]);

        $payment = Payment::create([
            'user_id' => Auth::id() ?? User::first()->id,
            'transaction_id' =>Str::uuid()->toString(),
            'amount' => $request->amount,
            'name' => $request->name,
            'email' => $request->email,
            'status' => 'pending',
            'payment_method' => 'online',
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
