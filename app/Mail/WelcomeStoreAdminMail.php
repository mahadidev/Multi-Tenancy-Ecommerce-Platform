<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeStoreAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $user;
    public $store;
    public $role;
    public $logoUrl;
    public $domain;

    public function __construct($user, $store, $role, $logoUrl, $domain)
    {
        $this->user = $user;
        $this->store = $store;
        $this->role = $role;
        $this->logoUrl = $logoUrl;
        $this->domain = $domain;
    }
   
    /**
     * Get the message envelope.
     */
    public function build()
    {
        return $this->subject("Welcome to {$this->store->name} as a {$this->role->name}")
                    ->view('emails.welcome-store-admin');
    }
}
