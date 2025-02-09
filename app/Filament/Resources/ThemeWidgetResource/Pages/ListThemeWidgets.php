<?php

namespace App\Filament\Resources\ThemeWidgetResource\Pages;

use App\Filament\Resources\ThemeWidgetResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListThemeWidgets extends ListRecords
{
    protected static string $resource = ThemeWidgetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
