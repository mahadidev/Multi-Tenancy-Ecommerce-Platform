<?php

namespace App\Filament\Resources\WidgetTypeResource\Pages;

use App\Filament\Resources\WidgetTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditWidgetType extends EditRecord
{
    protected static string $resource = WidgetTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
