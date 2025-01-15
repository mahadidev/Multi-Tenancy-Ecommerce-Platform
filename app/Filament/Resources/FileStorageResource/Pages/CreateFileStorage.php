<?php

namespace App\Filament\Resources\FileStorageResource\Pages;

use App\Filament\Resources\FileStorageResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Storage;


class CreateFileStorage extends CreateRecord
{
    protected static string $resource = FileStorageResource::class;
}
