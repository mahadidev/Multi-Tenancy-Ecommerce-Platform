<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ThemeResource\Pages;
use App\Filament\Resources\ThemeResource\RelationManagers;
use App\Models\Theme;
use App\Models\WidgetGroup;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;

class ThemeResource extends Resource
{
    protected static ?string $model = Theme::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationLabel = 'Theme';
    protected static ?string $pluralLabel = 'Themes';

    protected static ?string $navigationGroup = 'Theme Management';
   
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->unique(Theme::class, 'name', ignoreRecord: true)
                    ->maxLength(255)
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('thumbnail')
                    ->disk('public')
                    ->label('Thumbnail')
                    ->directory('themes')
                    ->image()
                    ->columnSpanFull()
                    ->required(),

                Forms\Components\Select::make('widget_groups')
                        ->relationship('widgetGroups', 'group_label') 
                        ->multiple() 
                        ->preload() 
                        ->label('Widget Groups')
                        ->required(),

                Forms\Components\Toggle::make('is_active')
                        ->label('Active')
                        ->default(true),
            ]);
    }

    

    public static function table(Table $table): Table
    {
        return $table
        ->columns([
            Tables\Columns\TextColumn::make('name')->sortable()->searchable(),
            Tables\Columns\TextColumn::make('slug')->sortable()->searchable(),
            Tables\Columns\BooleanColumn::make('is_active')->label('Active'),
            Tables\Columns\ImageColumn::make('thumbnail')->label('Thumbnail'),
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
            //
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
