<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


class OrderStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $store;
    public $logoUrl;    

    /**
     * Create a new message instance.
     */
    public function __construct($order, $store, $logoUrl)
    {
        $this->order = $order;
        $this->store = $store;
        $this->logoUrl = $logoUrl;
    }

    public function build()
    {
        return $this->subject('Order Status Updated')
            ->view('emails.order_status_updated')
            ->with([
                'order' => $this->order,
                'store' => $this->store,
                'logoUrl' => $this->logoUrl,
            ]);
    }
}
