<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ThemeWidgetResource\Pages;
use App\Filament\Resources\ThemeWidgetResource\RelationManagers;
use App\Models\ThemeWidget;
use App\Models\Theme;
use App\Models\WidgetType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ThemeWidgetResource extends Resource
{
    protected static ?string $model = ThemeWidget::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationLabel = 'Theme Widgets';
    protected static ?string $pluralLabel = 'Theme widgets';

    protected static ?string $navigationGroup = 'Theme Management';

    protected static ?int $navigationSort = 9;
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\Select::make('theme_id')
                            ->label('Theme')
                            ->options(Theme::all()->pluck('name', 'id')) // Fetch themes from the database
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('widget_type_id')
                            ->label('Widget Type')
                            ->options(WidgetType::all()->pluck('type', 'id')) // Fetch widget types from the database
                            ->searchable()
                            ->required(),

                        Forms\Components\TextInput::make('name')
                            ->label('Name')
                            ->placeholder('Enter widget name')
                            ->required(),

                        Forms\Components\TextInput::make('label')
                            ->label('Label')
                            ->placeholder('Enter widget label')
                            ->nullable(),

                        Forms\Components\Textarea::make('input')
                            ->label('Input')
                            ->placeholder('Enter input details')
                            ->nullable(),

                        Forms\Components\Toggle::make('is_editable')
                            ->label('Is Editable')
                            ->default(true),

                        Forms\Components\TextInput::make('thumbnail')
                            ->label('Thumbnail URL')
                            ->columnSpanFull()
                            ->required(),
                    ])
                    ->columns(2), // Arrange fields in two columns
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('theme.name')
                    ->label('Theme')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('widgetType.type')
                    ->label('Widget Type')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\BooleanColumn::make('is_editable')
                    ->label('Editable'),

                Tables\Columns\ImageColumn::make('thumbnail')
                    ->label('Thumbnail'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListThemeWidgets::route('/'),
            'create' => Pages\CreateThemeWidget::route('/create'),
            'edit' => Pages\EditThemeWidget::route('/{record}/edit'),
        ];
    }
}
