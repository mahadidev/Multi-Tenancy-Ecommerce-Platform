<?php

namespace App\Filament\Resources\PageTypeResource\Pages;

use App\Filament\Resources\PageTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPageTypes extends ListRecords
{
    protected static string $resource = PageTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
