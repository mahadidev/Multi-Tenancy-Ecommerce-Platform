<?php

namespace App\Filament\Seller\Resources\BlogResource\Pages;

use App\Filament\Seller\Resources\BlogResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateBlog extends CreateRecord
{
    protected static string $resource = BlogResource::class;
}
