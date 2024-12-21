<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Filters\SelectFilter;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $navigationGroup = 'Store Management';

    public static function getNavigationSort(): ?int
    {
        return 3; 
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\Grid::make(2) // Two-column layout
                            ->schema([
                                // Left Column
                                Forms\Components\Select::make('store_id')
                                    ->label('Store')
                                    ->options(Store::all()->pluck('name', 'id'))
                                    ->searchable()
                                    ->required(),

                                Forms\Components\Select::make('category_id')
                                    ->label('Category')
                                    ->options(Category::where('type', 'product')->pluck('name', 'id'))
                                    ->searchable()
                                    ->required(),

                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->label('Product Name')
                                    ->maxLength(255)->columnSpanFull(),

                                Forms\Components\TextInput::make('sku')
                                    ->label('SKU')
                                    ->unique(Product::class, 'sku', ignoreRecord: true)
                                    ->required(),

                                Forms\Components\TextInput::make('stock')
                                    ->label('Stock Quantity')
                                    ->numeric()
                                    ->nullable(),

                                Forms\Components\TextInput::make('cost_price')
                                    ->label('Cost Price')
                                    ->numeric()
                                    ->helperText('Leave empty if the product has variants.'),

                                Forms\Components\TextInput::make('price')
                                    ->label('Base Price')
                                    ->numeric()
                                    ->required()
                                    ->helperText('Leave empty if the product has variants.'),


                            ]),

                          
                        Forms\Components\Textarea::make('description')
                            ->label('Description')
                            ->rows(5),

                            Forms\Components\Grid::make(2) // Two-column layout
                            ->schema([
                                Forms\Components\FileUpload::make('thumbnail')
                                ->label('Thumbnail')
                                ->disk('public')
                                ->directory('products')
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
                                ])
                                ->required(),
    
                            Forms\Components\FileUpload::make('attachments')
                                ->label('Gallery')
                                ->disk('public')
                                ->directory('products')
                                ->image()
                                ->multiple()
                                ->imageEditor()
                                ->reorderable()
                                ->appendFiles()
                                ->openable()
                                ->downloadable()
                                ->imageEditorAspectRatios([
                                    '16:9',
                                    '4:3',
                                    '1:1',
                                ])
                                ->required(),
                                ]),
                       

                        // Right Column
                        Forms\Components\Grid::make(2) // Separate Grid for right column items
                            ->schema([

                                Forms\Components\Toggle::make('status')
                                    ->label('Active Status')
                                    ->reactive(),

                                Forms\Components\Toggle::make('has_variants')
                                    ->label('Has Variants')
                                    ->reactive(),
                                Forms\Components\Toggle::make('has_in_stocks')
                                    ->label('Has in Stocks')
                                    ->reactive(),


                            ]),

                        Forms\Components\Repeater::make('variants')
                            ->label('Variants')
                            ->relationship('variants')
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->label('Variant Name'),
                                Forms\Components\TextInput::make('sku')
                                    ->label('SKU')
                                    ->maxLength(50),
                                Forms\Components\TextInput::make('cost_price')
                                    ->label('Cost Price')
                                    ->numeric()
                                    ->required(),
                                Forms\Components\TextInput::make('price')
                                    ->label('Price')
                                    ->numeric()
                                    ->required(),
                            ])
                            ->hidden(fn(Forms\Get $get) => !$get('has_variants')), // Show only if has_variants is true
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\ImageColumn::make('thumbnail'),

                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('store.name'),

                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->sortable(),

                Tables\Columns\BooleanColumn::make('has_variants')
                    ->label('Has Variants'),

                Tables\Columns\BooleanColumn::make('status')
                    ->label('Active'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime('d M, Y'),
            ])
            ->filters([
                SelectFilter::make('store')
                ->relationship('store', 'name')
                ->searchable()
                ->multiple()
                ->preload(),

                SelectFilter::make('category')
                ->relationship('category', 'name')
                ->searchable()
                ->multiple()
                ->preload()
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
