<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Order;
use App\Models\Store;

class OrderNotification extends Notification
{
    use Queueable;

    public $order;
    public $store;
    public $logoUrl;


    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, Store $store, $logoUrl)
    {
        $this->order = $order;
        $this->store = $store;
        $this->logoUrl = $logoUrl;
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
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order Status Updated')
            ->view('emails.order_status_updated', [
                'order' => $this->order,
                'store' => $this->store,
                'logoUrl' => $this->logoUrl,
            ]);
    }


    // /**
    //  * Get the array representation of the notification.
    //  *
    //  * @return array<string, mixed>
    //  */
    // public function toArray(object $notifiable): array
    // {
    //     return [
    //         //
    //     ];
    // }

    public function toDatabase($notifiable)
    {
        return [
            'module' => 'order-status',
            'order_id' => $this->order->id,
            'order_uuid' => $this->order->uuid,
            'store_id' => $this->store->id,
            'store_name' => $this->store->name,
            'title' => 'Order Status Updated',
            'message' => 'Order status has been updated to ' . $this->order->status,
            'status' => $this->order->status,
        ];
    }
}
