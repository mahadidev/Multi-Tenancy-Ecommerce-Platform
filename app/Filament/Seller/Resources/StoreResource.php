<?php

namespace App\Filament\Seller\Resources;

use Filament\Forms;
use App\Models\User;
use Filament\Tables;
use App\Models\Store;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Illuminate\Support\Facades\Auth;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;


use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Seller\Resources\StoreResource\Pages;
use App\Filament\Seller\Resources\StoreResource\RelationManagers;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;




class StoreResource extends Resource
{
    protected static ?string $model = Store::class;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('owner_id', auth()->id());
    }

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
        ->schema([

           TextInput::make('name')
                ->label('Store Name')
                ->required()
                ->maxLength(255),

            Hidden::make('owner_id')
             ->default(Auth::user()->id),
               
           
           TextInput::make('domain')
                ->label('Store Domain')
                ->prefix('https://')
                ->rules(function ($get) {
                    $rules = [
                        'regex:/^[a-zA-Z0-9]+$/', 
                        'nullable', // Allow nullable (optional) during update
                    ];

                    // Apply these rules only if it's an insert (creation)
                    if (!$get('id')) {
                        $rules[] = 'required'; // Make domain required during insertion
                        $rules[] = 'unique:stores,domain'; // Ensure the domain is unique during insertion
                    } else {
                        // Exclude current record from the unique validation during update
                        $rules[] = 'unique:stores,domain,' . $get('id');
                    }

                    return $rules;
                })
                ->suffix('.'.parse_url(env('APP_URL'), PHP_URL_HOST).'.com'),
          
           TextInput::make('email')
                ->label('Store Email')
                ->required()
                ->email(),
            TextInput::make('phone')
                ->label('Store Phone')
                ->nullable(),
            Select::make('status')
                ->label('Store Status')
                ->options([
                    '1' => 'Active',
                    '0' => 'Deactive',
                ])
                ->native(false)
                ->default('1')
                ->required(),
            Textarea::make('location')
                ->label('Store Location')
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
