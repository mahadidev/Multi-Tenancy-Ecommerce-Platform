<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ThemeResource\Pages;
use App\Filament\Resources\ThemeResource\RelationManagers;
use App\Filament\Resources\ThemeResource\RelationManagers\PagesRelationManager;
use App\Models\Theme;
use App\Models\WidgetGroup;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;

class ThemeResource extends Resource
{
    protected static ?string $model = Theme::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationLabel = 'Themes';
    protected static ?string $pluralLabel = 'Themes';

    protected static ?string $navigationGroup = 'Theme Management';

    protected static ?int $navigationSort = 8;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->unique(Theme::class, 'name', ignoreRecord: true)
                    ->maxLength(255)
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('thumbnail')
                    ->label('Thumbnail URL')
                    ->columnSpanFull()
                    ->required(),

                Forms\Components\Toggle::make('is_active')
                    ->label('Active')
                    ->default(true),
            ]);
    }



    public static function text()
    {
        return [
            Forms\Components\TextInput::make('value')
                ->label('Text Value')
                ->required(),

        ];
    }

    public static function html()
    {
        return [
            Forms\Components\RichEditor::make('value')
                ->required(),
        ];
    }

    public static function textarea()
    {
        return [
            Forms\Components\Textarea::make('value')
                ->label('Content')
                ->required(),

        ];
    }

    public static function files()
    {
        return [
            Forms\Components\FileUpload::make('value')
                ->label('Image')
                ->image()
                ->required(),

        ];
    }

    public static function links()
    {
        return [
            Forms\Components\Grid::make(1)
                ->schema([
                    Forms\Components\TextInput::make('value')
                        ->label('Link URL')
                        ->required()
                        ->url()
                        ->placeholder('https://example.com'),
                ]),
        ];
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('slug')->sortable()->searchable(),
                Tables\Columns\BooleanColumn::make('is_active')->label('Active'),
                // Tables\Columns\ImageColumn::make('thumbnail')->label('Thumbnail'),
                Tables\Columns\TextColumn::make('created_at')->label('Created')->dateTime(),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            PagesRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListThemes::route('/'),
            'create' => Pages\CreateTheme::route('/create'),
            'edit' => Pages\EditTheme::route('/{record}/edit'),
        ];
    }
}
