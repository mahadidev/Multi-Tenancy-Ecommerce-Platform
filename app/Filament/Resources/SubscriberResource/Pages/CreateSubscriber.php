<?php

namespace App\Filament\Resources\SubscriberResource\Pages;

use App\Filament\Resources\SubscriberResource;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use App\Models\Subscriber;
use Illuminate\Validation\ValidationException;

class CreateSubscriber extends CreateRecord
{
    protected static string $resource = SubscriberResource::class;

    protected function beforeCreate(): void
    {
        $data = $this->data;
        
        $exists = Subscriber::where('email', $data['email'])
            ->where('store_id', $data['store_id'])
            ->exists();

        if ($exists) {
            Notification::make()
                ->title('Duplicate Entry')
                ->body('This email is already registered for this store.')
                ->danger()
                ->send();

            $this->halt();
        }
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Subscriber created')
            ->body('The subscriber has been created successfully.');
    }
}