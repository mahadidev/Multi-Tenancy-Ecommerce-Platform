<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductBrandResource\Pages;
use App\Filament\Resources\ProductBrandResource\RelationManagers;
use App\Models\ProductBrand;
use App\Models\Store;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;


class ProductBrandResource extends Resource
{
    protected static ?string $model = ProductBrand::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Store Management';
    protected static ?string $navigationLabel = 'Brands';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make([
                    Forms\Components\TextInput::make('name')
                        ->label('Brand Name')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\Select::make('store_id')
                        ->label('Store')
                        ->options(Store::all()->pluck('name', 'id'))
                        ->searchable()
                        ->required(),
                ])->columnSpan(6),
                Forms\Components\Card::make([
                    Forms\Components\FileUpload::make('image')
                        ->label('Brand Image')
                        ->directory('brand-images')
                        ->disk('public')
                        ->image()
                        ->imageEditor()
                        ->reorderable()
                        ->appendFiles()
                        ->openable()
                        ->downloadable()
                        ->imageEditorAspectRatios([
                            '16:9',
                            '4:3',
                            '1:1',
                        ]),

                ])->columnSpan(6),
            ])->columns(12);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->searchable()->sortable(),
                ImageColumn::make('image')->label('Brand Image'),
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('store.name')->label('Store')->searchable()->sortable(),
                TextColumn::make('created_at')->label('Created At')->dateTime('d M, Y'),
            ])
            ->filters([
                SelectFilter::make('store')
                    ->relationship('store', 'name')
                    ->searchable()
                    ->multiple()
                    ->preload(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ListProductBrands::route('/'),
            'create' => Pages\CreateProductBrand::route('/create'),
            'edit' => Pages\EditProductBrand::route('/{record}/edit'),
        ];
    }
}
