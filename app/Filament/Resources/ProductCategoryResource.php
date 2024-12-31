<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductCategoryResource\Pages;
use App\Filament\Resources\ProductCategoryResource\RelationManagers;
use App\Models\Category;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;


class ProductCategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Store Management';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('type', 'product');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')->required(),

                Forms\Components\Select::make('parent_id')
                ->label('Parent Category')
                ->options(
                    Category::whereNull('parent_id') // Fetch only root categories or any condition
                        ->pluck('name', 'id') // Get 'name' as the label and 'id' as the value
                        ->toArray()
                )
                ->nullable()
                ->searchable(),

                Forms\Components\Select::make('user_id')
                ->label('User')
                ->options(User::all()->pluck('name', 'id'))
                ->required(),

                Forms\Components\Select::make('type')
                ->label('Type')
                ->options([
                    'product' => 'Product',
                ])
                ->required()
                ->default('product'), 
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('slug'),
                TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime('d M, Y'),
            ])
            ->filters([
                SelectFilter::make('author')
                ->relationship('author', 'name')
                ->searchable()
                ->multiple()
                ->preload()
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
            'index' => Pages\ListProductCategories::route('/'),
            'create' => Pages\CreateProductCategory::route('/create'),
            'edit' => Pages\EditProductCategory::route('/{record}/edit'),
        ];
    }
}
