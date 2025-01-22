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
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    // public function toMail(object $notifiable): MailMessage
    // {
    //     // Log::info('Sending mail to: ' . $notifiable->email);
    //     $recipientEmail = $this->order->email ?? $notifiable->routeNotificationFor('mail');

    //     $subject = $this->isCustomer 
    //         ? 'Your Order Confirmation #' . $this->order->uuid
    //         : 'New Order Received #' . $this->order->uuid;

    //     $mailMessage = (new MailMessage)
    //         ->subject($subject)
    //         ->greeting($this->isCustomer ? 'Hello ' . $this->order->name : 'Hello Seller')
    //         ->line($this->isCustomer 
    //             ? 'Thank you for your order!' 
    //             : 'You have received a new order!');

    //     // Add order details
    //     $mailMessage->line('Order Details:')
    //         ->line('Order ID: ' . $this->order->uuid)
    //         ->line('Total Amount: $' . number_format($this->order->total, 2))
    //         ->line('Status: ' . ucfirst($this->order->status));

    //     if ($this->order->discount > 0) {
    //         $mailMessage->line('Discount Applied: $' . number_format($this->order->discount, 2));
    //     }

    //     // Add shipping details for seller
    //     if (!$this->isCustomer) {
    //         $mailMessage->line('Customer Details:')
    //             ->line('Name: ' . $this->order->name)
    //             ->line('Email: ' . $this->order->email)
    //             ->line('Phone: ' . $this->order->phone)
    //             ->line('Address: ' . $this->order->address);
    //     }

    //     return $mailMessage
    //         ->action(
    //             $this->isCustomer ? 'View Order' : 'Process Order',
    //             url('/orders/' . $this->order->uuid)
    //         )
    //         ->line('Thank you for using our service!');
    // }
    public function toMail(object $notifiable): MailMessage
{
    // Use routeNotificationFor to get the email for notification
    $recipientEmail = $this->order->email ?? $notifiable->routeNotificationFor('mail');

    $subject = $this->isCustomer
        ? 'Your Order Confirmation #' . $this->order->uuid
        : 'New Order Received #' . $this->order->uuid;

    $mailMessage = (new MailMessage)
        ->subject($subject)
        ->greeting($this->isCustomer ? 'Hello ' . $this->order->name : 'Hello Seller')
        ->line($this->isCustomer
            ? 'Thank you for your order!'
            : 'You have received a new order!')
        ->line('Order Details:')
        ->line('Order ID: ' . $this->order->uuid)
        ->line('Total Amount: $' . number_format($this->order->total, 2))
        ->line('Status: ' . ucfirst($this->order->status));

    if ($this->order->discount > 0) {
        $mailMessage->line('Discount Applied: $' . number_format($this->order->discount, 2));
    }

    if (!$this->isCustomer) {
        $mailMessage->line('Customer Details:')
            ->line('Name: ' . $this->order->name)
            ->line('Email: ' . $recipientEmail)
            ->line('Phone: ' . $this->order->phone)
            ->line('Address: ' . $this->order->address);
    }

    return $mailMessage
        ->action(
            $this->isCustomer ? 'View Order' : 'Process Order',
            url('/orders/' . $this->order->uuid)
        )
        ->line('Thank you for using our service!');
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
