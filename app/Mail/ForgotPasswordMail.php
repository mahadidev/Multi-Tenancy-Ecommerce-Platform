<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ForgotPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $token;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $resetUrl = config('app.url') . "/reset-password?token={$this->token}&email={$this->user->email}";

        return $this->subject('Reset Your Password')
            ->markdown('emails.forgot-password')
            ->with([
                'resetUrl' => $resetUrl,
                'userName' => $this->user->name,
            ]);
    }
    
}
