<?php

namespace App\Notifications;

use App\Models\Order;
use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class OrderConfirmationNotification extends Notification
{
    protected $order;
    protected $store;
    protected $isCustomer;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, Store $store, bool $isCustomer = true)
    {
        $this->order = $order;
        $this->store = $store;
        $this->isCustomer = $isCustomer;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */

    public function toMail($notifiable)
    {
        $subject = $this->isCustomer
            ? 'Your Order Confirmation #' . $this->order->uuid
            : 'New Order Received #' . $this->order->uuid;

        $appUrl = config('app.url');

        // Ensure we have a trailing slash
        if (!str_ends_with($appUrl, '/')) {
            $appUrl .= '/';
        }

        // Get store logo URL
        $logoUrl = null;
        if ($this->store->logo) {
            $logoUrl = $appUrl . 'storage/' . $this->store->logo;
        } else {
            $logoUrl = $appUrl . 'images/logo-text.png';
        }

        // Generate PDF content dynamically
        $pdf = app('dompdf.wrapper');
        $pdf->loadView('pdf.order_confirmation', [
            'order' => $this->order,
            'store' => $this->store,
            'isCustomer' => $this->isCustomer,
        ]);

        return (new MailMessage)
            ->subject($subject)
            ->greeting($this->isCustomer ? 'Hello ' . $this->order->name : 'Hello Seller')
            ->line($this->isCustomer
                ? 'Thank you for your order!'
                : 'You have received a new order!')
            // ->line('Order #' . $this->order)
            ->view('emails.order_confirmation', [
                'order' => $this->order,
                'store' => $this->store,
                'isCustomer' => $this->isCustomer,
                'appUrl' => $appUrl,
                'logoUrl' => $logoUrl // Pass the logo URL to the view
            ])
            ->attachData($pdf->output(), "Order_Confirmation_{$this->order->uuid}.pdf", [
                'mime' => 'application/pdf',
            ]);
    }


    // Example method to generate the PDF (use your preferred method)
    protected function generatePdf($path)
    {
        $pdf = app('dompdf.wrapper');
        $pdf->loadView('pdf.order_confirmation', [
            'order' => $this->order,
            'store' => $this->store,
            'isCustomer' => $this->isCustomer,
        ]);
        $pdf->save($path);
    }

    public function toDatabase($notifiable)
    {
        return [
            'module' => 'order',
            'order_id' => $this->order->id,
            'order_uuid' => $this->order->uuid,
            'store_id' => $this->store->id,
            'store_name' => $this->store->name,
            'title' => $this->isCustomer ? 'Order Confirmed' : 'New Order Received',
            'message' => $this->isCustomer
                ? 'Your order #' . $this->order->uuid . ' has been confirmed.'
                : 'New order #' . $this->order->uuid . ' received from ' . $this->order->name,
            'amount' => $this->order->total,
            'status' => $this->order->status,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
