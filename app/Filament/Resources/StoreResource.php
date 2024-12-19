<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StoreResource\Pages;
use App\Filament\Resources\StoreResource\RelationManagers;
use App\Models\Store;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Filters\SelectFilter;

class StoreResource extends Resource
{
    protected static ?string $model = Store::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationLabel = 'Stores';

    protected static ?string $pluralModelLabel = 'Stores';

    protected static ?string $navigationGroup = 'Store Management';

    protected static ?string $slug = 'stores';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('owner_id')
                    ->label('Store Owner')
                    ->options(User::all()->pluck('name', 'id'))
                    ->required()
                    ->searchable(),
                Forms\Components\TextInput::make('domain')
                    ->prefix('https://')
                    ->rules([
                        'required',
                        'regex:/^[a-zA-Z0-9]+$/', // Only alphanumeric characters
                        'unique:stores,domain' // Ensure the domain is unique in the 'stores' table
                    ])
                    ->suffix('.'.parse_url(env('APP_URL'), PHP_URL_HOST).'.com'),
                Forms\Components\TextInput::make('email')
                    ->required()
                    ->email(),
                Forms\Components\TextInput::make('phone')
                    ->nullable(),
                Forms\Components\Select::make('status')
                    ->options([
                        '1' => 'Active',
                        '0' => 'Deactive',
                    ])
                    ->native(false)
                    ->default('1')
                    ->required(),
                Forms\Components\Textarea::make('location')
                    ->nullable()
                    ->maxLength(65535),
            ]);
    }


    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data['domain'] = 'https://'.$data['domain'].'.'.parse_url(env('APP_URL'), PHP_URL_HOST).'.com';
        return $data;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('name')
                    ->label('Store')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('owner.name')
                    ->label('Owner')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('domain')
                    ->prefix('https://')
                    ->suffix('.'.parse_url(env('APP_URL'), PHP_URL_HOST).'.com')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime(),
            ])
            ->filters([
                SelectFilter::make('owner')
                    ->relationship('owner', 'name')
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
            'index' => Pages\ListStores::route('/'),
            'create' => Pages\CreateStore::route('/create'),
            'edit' => Pages\EditStore::route('/{record}/edit'),
        ];
    }
}
