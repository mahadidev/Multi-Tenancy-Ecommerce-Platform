<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FileStorageResource\Pages;
use App\Filament\Resources\FileStorageResource\RelationManagers;
use App\Models\FileStorage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\ViewColumn;
use Filament\Tables\Actions\Action;

use Illuminate\Database\Eloquent\Model;

class FileStorageResource extends Resource
{
    protected static ?string $model = FileStorage::class;

    protected static ?string $navigationIcon = 'heroicon-o-folder';
    protected static ?string $navigationLabel = 'File Storages';
    protected static ?string $pluralLabel = 'File Storages';
    protected static ?string $navigationGroup = 'Settings';

    public static function getNavigationSort(): ?int
    {
        return 4;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('File Storage')
                    ->schema([
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->default(auth()->id())
                            ->columnSpanFull()
                            ->required(),

                        FileUpload::make('location')
                            ->label('File')
                            ->directory('file_storage')
                            ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/webp', 'image/png', 'application/pdf'])
                            ->maxSize(10048)
                            ->columnSpanFull()
                            ->required()
                            ->imageEditor()
                            ->appendFiles()
                            ->openable()
                            ->downloadable()
                            ->imageEditorAspectRatios(['16:9', '4:3', '1:1'])
                            ->storeFileNamesIn('original_name'), // Store original filename if needed
                    ])
            ])
            ->columns(12);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                // ImageColumn::make('location')
                //     ->label('File')
                //     ->url(fn(Model $record) => $record->location),

                ViewColumn::make('file_preview')
                    ->label('File')
                    ->view('components.file-preview'),

                TextColumn::make('name')
                    ->searchable(),

                TextColumn::make('type')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pdf' => 'danger',
                        'image' => 'success',
                        default => 'gray',
                    }),

                TextColumn::make('user.name')
                    ->sortable()
                    ->searchable(),


                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'pdf' => 'PDF',
                        'image' => 'Image',
                    ]),

                Tables\Filters\SelectFilter::make('user')
                    ->relationship('user', 'name'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ListFileStorages::route('/'),
            // 'create' => Pages\CreateFileStorage::route('/create'),
            // 'edit' => Pages\EditFileStorage::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'type', 'user.name'];
    }
}
