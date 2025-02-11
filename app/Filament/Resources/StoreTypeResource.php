<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StoreTypeResource\Pages;
use App\Filament\Resources\StoreTypeResource\RelationManagers;
use App\Models\StoreType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;

class StoreTypeResource extends Resource
{
    protected static ?string $model = StoreType::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Settings';

    public static function getNavigationSort(): ?int
    {
        return 5;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('label')->required()->columnSpan('full'),
                TextInput::make('type')->required()->columnSpan('full'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label')->searchable(),
                TextColumn::make('type')->searchable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStoreTypes::route('/'),
            'create' => Pages\CreateStoreType::route('/create'),
            'edit' => Pages\EditStoreType::route('/{record}/edit'),
        ];
    }
}
