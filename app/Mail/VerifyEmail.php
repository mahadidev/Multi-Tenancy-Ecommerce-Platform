<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $verificationUrl;
    public $userName;
    public $storeName;

    public function __construct($verificationUrl, $userName, $storeName)
    {
        $this->verificationUrl = $verificationUrl;
        $this->userName = $userName;
        $this->storeName = $storeName;
    }

    public function build()
    {
        return $this->markdown('emails.verify_email')
            ->subject('Verify Your Email')
            ->with([
                'verificationUrl' => $this->verificationUrl,
                'userName' => $this->userName,
                'storeName' => $this->storeName,
            ]);
    }
}
