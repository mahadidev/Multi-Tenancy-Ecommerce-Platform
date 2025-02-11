<?php

namespace App\Filament\Resources\StoreTypeResource\Pages;

use App\Filament\Resources\StoreTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditStoreType extends EditRecord
{
    protected static string $resource = StoreTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
