<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class OrderConfirmationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;
    protected $isCustomer;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, bool $isCustomer = true)
    {
        $this->order = $order;
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

        return (new MailMessage)
            ->subject($subject)
            ->greeting($this->isCustomer ? 'Hello ' . $this->order->name : 'Hello Seller')
            ->line($this->isCustomer
                ? 'Thank you for your order!'
                : 'You have received a new order!')
            ->view('emails.order_confirmation', [
                'order' => $this->order,
                'isCustomer' => $this->isCustomer,
            ]);
    }


    public function toDatabase($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'order_uuid' => $this->order->uuid,
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
