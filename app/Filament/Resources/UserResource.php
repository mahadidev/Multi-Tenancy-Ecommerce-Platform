<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-circle';
    protected static ?string $navigationGroup = 'User Management';
    protected static ?int $navigationSort = 1;

    public static function getNavigationSort(): ?int
    {
        return 1; // Assign a sort order for User Management
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
            Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255),

            Forms\Components\TextInput::make('email')
                ->required()
                ->email()
                ->maxLength(255)
                ->unique(User::class, 'email', ignoreRecord: true),
            
            Forms\Components\TextInput::make('phone')
                ->required(),

            Forms\Components\TextInput::make('password')
                ->password()
                ->minLength(6)
                ->dehydrateStateUsing(fn ($state) => bcrypt($state))
                ->required(fn (string $context) => $context === 'create'),

            Forms\Components\MultiSelect::make('roles')
                ->relationship('roles', 'name')
                ->preload()
                ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('email')->searchable(),
                Tables\Columns\TextColumn::make('roles.name')->label('Roles'),
                Tables\Columns\TextColumn::make('created_at')->dateTime(),
            ])
            ->filters([
                Tables\Filters\Filter::make('role')
                ->form([
                    Forms\Components\Select::make('role')
                        ->label('Role')
                        ->options(\Spatie\Permission\Models\Role::pluck('name', 'name'))
                        ->searchable()
                ])
                ->query(function (Builder $query, array $data) {
                    return $query->when(
                        $data['role'] ?? null,
                        fn (Builder $query, $role) => $query->whereHas('roles', fn (Builder $query) => $query->where('name', $role))
                    );
                }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
