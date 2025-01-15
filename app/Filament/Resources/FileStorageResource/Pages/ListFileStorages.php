<?php

namespace App\Filament\Resources\FileStorageResource\Pages;

use App\Filament\Resources\FileStorageResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFileStorages extends ListRecords
{
    protected static string $resource = FileStorageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
