<?php

namespace App\Filament\Resources\ThemeWidgetResource\Pages;

use App\Filament\Resources\ThemeWidgetResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditThemeWidget extends EditRecord
{
    protected static string $resource = ThemeWidgetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
