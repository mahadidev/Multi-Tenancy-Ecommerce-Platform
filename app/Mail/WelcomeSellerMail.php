<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Store;

class WelcomeSellerMail extends Mailable
{
    use Queueable, SerializesModels;

    public $store;
    public $logoUrl;
    public $domain;

    public function __construct(Store $store, $logoUrl, $domain)
    {
        $this->store = $store;
        $this->logoUrl = $logoUrl;
        $this->domain = $domain;
    }

    public function build()
    {
        return $this->subject('Welcome to Chologori - Your Store Setup is Complete!')
                    ->view('emails.welcome-seller')
                    ->with([
                        'store' => $this->store,
                        'logoUrl' => $this->logoUrl,
                        'domain' => $this->domain,
                    ]);
    }
}