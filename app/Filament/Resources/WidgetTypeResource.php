<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WidgetTypeResource\Pages;
use App\Filament\Resources\WidgetTypeResource\RelationManagers;
use App\Models\WidgetType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class WidgetTypeResource extends Resource
{
    protected static ?string $model = WidgetType::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationLabel = 'Widgets Type';
    protected static ?string $pluralLabel = 'Widgets Type';

    protected static ?string $navigationGroup = 'Settings';

    public static function getNavigationSort(): ?int
    {
        return 4;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([Forms\Components\Card::make([Forms\Components\TextInput::make('type')->label('Type')->required()->maxLength(255), Forms\Components\TextInput::make('label')->label('Label')->required()->maxLength(255)])->columns(1)]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([Tables\Columns\TextColumn::make('label')->label('Label')->searchable()->sortable(),Tables\Columns\TextColumn::make('type')->label('Type')->searchable()->sortable(), Tables\Columns\TextColumn::make('created_at')->label('Created At')->dateTime()->sortable(), Tables\Columns\TextColumn::make('updated_at')->label('Updated At')->dateTime()->sortable()])
            ->filters([
                //
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
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
            'index' => Pages\ListWidgetTypes::route('/'),
            'create' => Pages\CreateWidgetType::route('/create'),
            'edit' => Pages\EditWidgetType::route('/{record}/edit'),
        ];
    }
}
