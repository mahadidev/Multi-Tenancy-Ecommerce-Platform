<?php

namespace App\Filament\Resources\FileStorageResource\Pages;

use App\Filament\Resources\FileStorageResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;


class EditFileStorage extends EditRecord
{
    protected static string $resource = FileStorageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
