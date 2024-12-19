<?php

namespace App\Filament\Resources;

use Str;
use Filament\Forms;
use Filament\Tables;
use App\Models\Category;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Actions\DeleteAction;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Actions\DeleteBulkAction;
use App\Filament\Resources\CategoryResource\Pages;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\CategoryResource\RelationManagers;
use Filament\Tables\Filters\SelectFilter;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')->required(),
                
                Select::make('type')
                ->label('Type')
                ->options([
                    '1' => 'Blog',
                    '2' => 'Product',
                ])
                ->required()
                ->default('1'), // Set a default value if needed
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('slug'),
                TextColumn::make('type')
                ->label('Type') // Optional, adds a label for the column
                ->formatStateUsing(function (string $state): string {
                    return match ($state) {
                        '1' => 'Blog',  // If type is '1', display 'Blog'
                        '2' => 'Product',  // If type is '2', display 'Product'
                        default => ucfirst($state),  // Otherwise, capitalize the type value
                    };
                })->searchable(),

                
            ])
            ->filters([
                SelectFilter::make('type')  // Create a custom filter for 'type'
                ->options([
                    '1' => 'Blog',
                    '2' => 'Product',
                ])
                ->label('Filter by Type'),  // Add a label for the filter
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
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
