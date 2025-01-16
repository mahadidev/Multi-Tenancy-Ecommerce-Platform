<?php

namespace App\Filament\Resources\PageTypeResource\Pages;

use App\Filament\Resources\PageTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePageType extends CreateRecord
{
    protected static string $resource = PageTypeResource::class;
}
