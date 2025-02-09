<?php

namespace App\Filament\Resources\WidgetTypeResource\Pages;

use App\Filament\Resources\WidgetTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListWidgetTypes extends ListRecords
{
    protected static string $resource = WidgetTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
