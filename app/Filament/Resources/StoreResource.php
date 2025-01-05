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
use Illuminate\Validation\Rule;
use Filament\Forms\Components\Repeater;

class StoreResource extends Resource
{
    protected static ?string $model = Store::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationLabel = 'Stores';

    protected static ?string $pluralModelLabel = 'Stores';

    protected static ?string $navigationGroup = 'Store Management';

    protected static ?int $navigationSort = 1;

    protected static ?string $slug = 'stores';

    public static function getNavigationSort(): ?int
    {
        return 2; // Assign a sort order for User Management
    }

    // public static function form(Form $form): Form
    // {
    //     return $form
    //         ->schema([

    //             TextInput::make('name')
    //                 ->required()
    //                 ->maxLength(255),
    //             Select::make('owner_id')
    //                 ->label('Store Owner')
    //                 ->options(User::all()->pluck('name', 'id'))
    //                 ->required()
    //                 ->searchable(),
    //             TextInput::make('domain')
    //                 ->prefix('https://')
    //                 ->rules(function ($record) {
    //                     return [
    //                         'nullable', // Make it nullable
    //                         'regex:/^[a-zA-Z0-9\-]+$/', // Only alphanumeric characters and hyphens
    //                         Rule::unique('stores', 'domain')->ignore($record->id ?? null), // Allow the current value for edit
    //                     ];
    //                 })
    //                 ->suffix('.' . parse_url(env('APP_URL'), PHP_URL_HOST) . '.com'),
    //             TextInput::make('email')
    //                 ->required()
    //                 ->email(),
    //             TextInput::make('phone')
    //                 ->nullable(),
    //             TextInput::make('currency')
    //                 ->required(),
    //             Select::make('status')
    //                 ->options([
    //                     '1' => 'Active',
    //                     '0' => 'Deactive',
    //                 ])
    //                 ->native(false)
    //                 ->default('1')
    //                 ->required(),
    //             Textarea::make('location')
    //                 ->nullable()
    //                 ->maxLength(65535),
    //             Forms\Components\FileUpload::make('logo')
    //                 ->label('Logo')
    //                 ->disk('public')
    //                 ->directory('stores')
    //                 ->image()
    //                 ->imageEditor()
    //                 ->reorderable()
    //                 ->appendFiles()
    //                 ->openable()
    //                 ->downloadable()
    //                 ->imageEditorAspectRatios([
    //                     '16:9',
    //                     '4:3',
    //                     '1:1',
    //                 ])
    //                 ->nullable(),
    //             Forms\Components\FileUpload::make('dark_logo')
    //                 ->label('Dark Logo')
    //                 ->disk('public')
    //                 ->directory('stores')
    //                 ->image()
    //                 ->imageEditor()
    //                 ->reorderable()
    //                 ->appendFiles()
    //                 ->openable()
    //                 ->downloadable()
    //                 ->imageEditorAspectRatios([
    //                     '16:9',
    //                     '4:3',
    //                     '1:1',
    //                 ])
    //                 ->nullable(),

    //         ]);
    // }

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')->required()->maxLength(255),
            Select::make('owner_id')->label('Store Owner')->options(User::all()->pluck('name', 'id'))->required()->searchable(),
            TextInput::make('domain')
                ->prefix('https://')
                ->rules(function ($record) {
                    return ['nullable', 'regex:/^[a-zA-Z0-9\-]+$/', Rule::unique('stores', 'domain')->ignore($record->id ?? null)];
                })
                ->suffix('.' . parse_url(env('APP_URL'), PHP_URL_HOST) . '.com'),
            TextInput::make('email')->required()->email(),
            TextInput::make('phone')->nullable(),
            TextInput::make('currency')->required(),
            Select::make('status')
                ->options([
                    '1' => 'Active',
                    '0' => 'Deactive',
                ])
                ->native(false)
                ->default('1')
                ->required(),
            Textarea::make('location')->nullable()->maxLength(65535),
            Forms\Components\FileUpload::make('logo')
                ->label('Logo')
                ->disk('public')
                ->directory('stores')
                ->image()
                ->imageEditor()
                ->reorderable()
                ->appendFiles()
                ->openable()
                ->downloadable()
                ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
                ->nullable(),
            Forms\Components\FileUpload::make('dark_logo')
                ->label('Dark Logo')
                ->disk('public')
                ->directory('stores')
                ->image()
                ->imageEditor()
                ->reorderable()
                ->appendFiles()
                ->openable()
                ->downloadable()
                ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
                ->nullable(),

            // Add a Repeater for settings
            Repeater::make('settings')
                ->label('Settings')
                ->schema([

                    // socila media settings
                    Repeater::make('social_media')
                        ->label('Social Media')
                        ->schema([TextInput::make('facebook.url')->label('Facebook URL')->nullable()->url(), TextInput::make('youtube.url')->label('YouTube URL')->nullable()->url(), TextInput::make('instagram.url')->label('Instagram URL')->nullable()->url(), TextInput::make('tiktok.url')->label('TikTok URL')->nullable()->url()]),


                    // Contact section
                    Repeater::make('contact')
                        ->label('Contact')
                        ->schema([
                            Repeater::make('customer_support')
                                ->label('Customer Support')
                                ->schema([
                                    Repeater::make('phones')
                                        ->label('Phone')
                                        ->schema([TextInput::make('label')->label('Phone Label')->required(), TextInput::make('number')->label('Phone Number')->required()])
                                        ->minItems(1)
                                        ->required(),

                                    Repeater::make('emails')
                                        ->label('Email')
                                        ->schema([TextInput::make('label')->label('Email Label')->required(), TextInput::make('email')->label('Email Address')->email()->required()])
                                        ->minItems(1)
                                        ->required(),
                                ])
                                ->required(),
                        ])
                        ->required(),
                ])
                ->columnSpanFull()
                ->required(),
        ]);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data['domain'] = 'https://' . $data['domain'] . '.' . parse_url(env('APP_URL'), PHP_URL_HOST) . '.com';
        return $data;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('Store')->sortable()->searchable(),
                TextColumn::make('owner.name')->label('Owner')->sortable()->searchable(),
                TextColumn::make('domain')
                    ->prefix('https://')
                    ->suffix('.' . parse_url(env('APP_URL'), PHP_URL_HOST) . '.com')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('email')->sortable()->searchable(),
                TextColumn::make('currency')->sortable()->searchable(),
            ])
            ->filters([SelectFilter::make('owner')->relationship('owner', 'name')->searchable()->multiple()->preload()])
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
            'index' => Pages\ListStores::route('/'),
            'create' => Pages\CreateStore::route('/create'),
            'edit' => Pages\EditStore::route('/{record}/edit'),
        ];
    }
}
