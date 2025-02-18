<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeCustomerMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $user;
    public $store;
    public $logoUrl;
    public $domain;

    public function __construct($user, $store, $logoUrl, $domain)
    {
        $this->user = $user;
        $this->store = $store;
        $this->logoUrl = $logoUrl;
        $this->domain = $domain;
    }
   
    /**
     * Get the message envelope.
     */ 
    public function build()
    {
        return $this->subject("Welcome to the {$this->store->name}")
                    ->view('emails.welcome-customer');
    }
}
