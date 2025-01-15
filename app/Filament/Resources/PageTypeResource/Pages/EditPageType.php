<?php

namespace App\Filament\Resources\PageTypeResource\Pages;

use App\Filament\Resources\PageTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPageType extends EditRecord
{
    protected static string $resource = PageTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
