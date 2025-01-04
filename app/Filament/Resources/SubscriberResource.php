<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubscriberResource\Pages;
use App\Filament\Resources\SubscriberResource\RelationManagers;
use App\Models\Subscriber;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Filters\SelectFilter;
use App\Models\Store;
use App\Exceptions\ValidationException;
use Filament\Notifications\Notification;

class SubscriberResource extends Resource
{
    protected static ?string $model = Subscriber::class;

    protected static ?string $navigationIcon = 'heroicon-o-bell';
    protected static ?string $navigationLabel = 'Subscribers';
    protected static ?string $pluralLabel = 'Subscribers';

    protected static ?string $navigationGroup = 'Subscribers Management';

    protected static ?int $navigationSort = 7;

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 1)->count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('email')
                            ->label('Email Address')
                            ->placeholder('Enter email address')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->disabled(fn(?Subscriber $record) => $record !== null), // Disabled only for edit

                        Forms\Components\Select::make('store_id')
                            ->label('Store')
                            ->options(Store::all()->pluck('name', 'id'))
                            ->searchable()
                            ->required()
                            ->disabled(fn(?Subscriber $record) => $record !== null), // Disabled only for edit

                        Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                1 => 'Active',
                                0 => 'Inactive',
                            ])
                            ->default(1)
                            ->required(),
                    ]),
            ]);
    }



    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('store.name')
                    ->label('Store')
                    ->sortable(),
                Tables\Columns\BooleanColumn::make('status')
                    ->label('Active'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Subscribed On')
                    ->dateTime(),
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
                // Tables\Actions\DeleteAction::make(),
            ]);
        // ->bulkActions([
        //     // Tables\Actions\DeleteBulkAction::make(),
        // ]);
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
            'index' => Pages\ListSubscribers::route('/'),
            'create' => Pages\CreateSubscriber::route('/create'),
            'edit' => Pages\EditSubscriber::route('/{record}/edit'),
        ];
    }
}
