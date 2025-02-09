<?php

namespace App\Filament\Resources\SvgIconResource\Pages;

use App\Filament\Resources\SvgIconResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSvgIcon extends EditRecord
{
    protected static string $resource = SvgIconResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
