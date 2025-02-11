<?php

namespace App\Filament\Resources\StoreTypeResource\Pages;

use App\Filament\Resources\StoreTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListStoreTypes extends ListRecords
{
    protected static string $resource = StoreTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
