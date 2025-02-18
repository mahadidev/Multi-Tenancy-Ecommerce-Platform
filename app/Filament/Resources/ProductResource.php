<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\Brand;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Filters\SelectFilter;
use Closure;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $navigationGroup = 'Store Management';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Grid::make(12)
                ->schema([
                    Forms\Components\Card::make('Product Details')
                        ->schema([

                            Forms\Components\TextInput::make('name')
                                ->required()
                                ->label('Product Name')
                                ->maxLength(255),
                            Forms\Components\TextInput::make('sku')
                                ->label('SKU')
                                ->unique(Product::class, 'sku', ignoreRecord: true)
                                ->required(),
                            Forms\Components\Grid::make(2)
                                ->schema([
                                    Forms\Components\TextInput::make('stock')
                                        ->label('Stock Quantity')
                                        ->numeric()
                                        ->nullable(),

                                    Forms\Components\TextInput::make('price')
                                        ->label('Base Price')
                                        ->numeric()
                                        // ->required()
                                        ->helperText('Leave empty if the product has variants.'),
                                ]),
                        ])->columnSpan(6),

                    Forms\Components\Grid::make(1)
                        ->schema([
                            Forms\Components\Card::make('General Information')
                                ->schema([
                                    Forms\Components\Select::make('store_id')
                                        ->label('Store')
                                        ->options(Store::all()->pluck('name', 'id'))
                                        ->searchable()
                                        ->required(),
                                    Forms\Components\Grid::make(2)
                                        ->schema([
                                            Forms\Components\Select::make('category_id')
                                                ->label('Category')
                                                ->options(Category::where('type', 'product')->pluck('name', 'id'))
                                                ->searchable()
                                                ->required(),

                                            Forms\Components\Select::make('brand_id')
                                                ->label('Brand')
                                                ->options(Brand::all()->pluck('name', 'id'))
                                                ->searchable()
                                                ->required(),
                                        ]),
                                ]),
                            Forms\Components\Card::make('Status and Trending')
                                ->schema([
                                    Forms\Components\Grid::make(2)
                                        ->schema([
                                            Forms\Components\Toggle::make('status')
                                                ->label('Active Status')
                                                ->reactive(),

                                            Forms\Components\Toggle::make('is_trending')
                                                ->label('Is Trending')
                                                ->default(false),
                                        ]),
                                ]),
                        ])->columnSpan(6),
                ]),

            // Full-width short description
            Forms\Components\Card::make('Short Description')
                ->schema([
                    Forms\Components\Textarea::make('short_description')
                        ->label('Short Description')
                        ->rows(3),
                ]),

            // Full-width description
            Forms\Components\Card::make('Description')
                ->schema([
                    Forms\Components\Textarea::make('description')
                        ->label('Description')
                        ->rows(5),
                ]),


            Forms\Components\Card::make('Media')
                ->schema([
                    Forms\Components\Grid::make(2)
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
                                ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
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
                                ->imageEditorAspectRatios(['16:9', '4:3', '1:1']),
                                // ->required(),
                        ]),
                ]),

            Forms\Components\Card::make('Variants')
                ->schema([
                            Forms\Components\Toggle::make('has_variants')
                                ->label('Has Variants')
                                ->reactive(),
                            Forms\Components\Repeater::make('variants')
                                ->label('Variants')
                                ->relationship('variants')
                                ->schema([
                                    Forms\Components\TextInput::make('label')
                                        ->label('Variant Label')
                                        ->required()
                                        ->hint('e.g., Color, Size, Wholesale Package'),

                                    Forms\Components\Repeater::make('options')
                                        ->label('Options')
                                        ->schema([
                                                    Forms\Components\TextInput::make('label')
                                                        ->label('Option Label')
                                                        ->required(),
                                                    Forms\Components\TextInput::make('code')
                                                        ->label('Option Code')
                                                        ->nullable()
                                                        ->hint('Only applicable for color variants'),
                                                    Forms\Components\TextInput::make('price')
                                                        ->label('Price')
                                                        ->numeric()
                                                        ->required()
                                                        ->hint('Specify the price for this option'),
                                                    Forms\Components\TextInput::make('qty_stock')
                                                        ->label('Stock Quantity')
                                                        ->numeric()
                                                        ->required()
                                                        ->hint('Specify the stock quantity for this option'),
                                        ])
                                        ->required()
                                        ->minItems(1)
                                ])
                                ->columns(1)
                                ->hidden(fn(Forms\Get $get) => !$get('has_variants')),

                ])->columnSpan(7),
            Forms\Components\Card::make('Discounts')
                ->schema([
                    Forms\Components\Toggle::make('has_discount')
                        ->label('Has Discount')
                        ->default(false)
                        ->reactive(),

                    Forms\Components\DateTimePicker::make('discount_to')
                        ->label('Discount Until')
                        ->required()
                        ->hidden(fn(Forms\Get $get) => !$get('has_discount')),

                    Forms\Components\Select::make('discount_type')
                        ->label('Discount Type')
                        ->options([
                            'flat' => 'Flat Amount',
                            'percentage' => 'Percentage(%)',
                        ])
                        ->required()
                        ->reactive()
                        ->hidden(fn(Forms\Get $get) => !$get('has_discount')),

                    Forms\Components\TextInput::make('discount_amount')
                        ->label(fn(Forms\Get $get) => $get('discount_type') === 'percentage' ? 'Discount Percentage' : 'Discount Amount')
                        ->hint(fn(Forms\Get $get) => $get('discount_type') === 'percentage' ? 'Percentage cannot be more than 100%.' : '')
                        ->numeric()
                        ->required()
                        ->rules([
                            fn(Forms\Get $get): Closure => function (string $attribute, $value, Closure $fail) use ($get) {
                                if ($get('discount_type') === 'percentage' && $value > 100) {
                                    $fail('Discount Percentage cannot be more than 100%.');
                                }
                            },
                        ])
                        ->hidden(fn(Forms\Get $get) => !$get('has_discount')),
                ])->columnSpan(5),
        ])->columns(12);
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

                Tables\Columns\TextColumn::make('category.name'),

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
