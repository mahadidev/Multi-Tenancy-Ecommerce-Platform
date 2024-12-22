<?php

namespace App\Filament\Resources;

use Filament\Forms;
use App\Models\User;
use Filament\Tables;
use App\Models\Store;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;
use App\Filament\Resources\StoreResource\Pages;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\StoreResource\RelationManagers;

class StoreResource extends Resource
{
    protected static ?string $model = Store::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationLabel = 'Stores';

    protected static ?string $pluralModelLabel = 'Stores';

    protected static ?string $navigationGroup = 'Store Management';

    protected static ?string $slug = 'stores';

    public static function getNavigationSort(): ?int
    {
        return 2; // Assign a sort order for User Management
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

               TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Select::make('owner_id')
                    ->label('Store Owner')
                    ->options(User::all()->pluck('name', 'id'))
                    ->required()
                    ->searchable(),
               TextInput::make('domain')
                    ->prefix('https://')
                    ->rules([
                        'required',
                        'regex:/^[a-zA-Z0-9]+$/', // Only alphanumeric characters
                        'unique:stores,domain' // Ensure the domain is unique in the 'stores' table
                    ])
                    ->suffix('.'.parse_url(env('APP_URL'), PHP_URL_HOST).'.com'),
               TextInput::make('email')
                    ->required()
                    ->email(),
                TextInput::make('phone')
                    ->nullable(),
                Select::make('status')
                    ->options([
                        '1' => 'Active',
                        '0' => 'Deactive',
                    ])
                    ->native(false)
                    ->default('1')
                    ->required(),
                Textarea::make('location')
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

               TextColumn::make('name')
                    ->label('Store')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('owner.name')
                    ->label('Owner')
                    ->sortable()
                    ->searchable(),
               TextColumn::make('domain')
                    ->prefix('https://')
                    ->suffix('.'.parse_url(env('APP_URL'), PHP_URL_HOST).'.com')
                    ->sortable()
                    ->searchable(),
               TextColumn::make('email')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('created_at')
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
