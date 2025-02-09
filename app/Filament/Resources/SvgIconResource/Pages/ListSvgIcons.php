<?php

namespace App\Filament\Resources\SvgIconResource\Pages;

use App\Filament\Resources\SvgIconResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSvgIcons extends ListRecords
{
    protected static string $resource = SvgIconResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
