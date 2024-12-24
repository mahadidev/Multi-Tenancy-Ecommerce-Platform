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
    protected static ?string $navigationLabel = 'Themes';
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

                Forms\Components\Toggle::make('is_active')
                    ->label('Active')
                    ->default(true),
                Forms\Components\Toggle::make('has_widgets')
                    ->label('Has widgets')
                    ->reactive(),

                Forms\Components\Repeater::make('widgets')
                    ->label('Widgets')
                    ->relationship('widgets')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Name')
                            ->required()
                            ->hint('e.g., Header, Navbar, Contact Form'),
                        Forms\Components\TextInput::make('label')
                            ->label('Label')
                            ->required(),
                        Forms\Components\Select::make('type')
                            ->label('Field Type')
                            ->options([
                                'html' => 'HTML Content',
                                'text' => 'Text Field',
                                'textarea' => 'Textarea Field',
                                'image' => 'Image Upload',
                                'links' => 'Links',
                            ])
                            ->required()
                            ->live()
                            ->afterStateUpdated(function ($state, callable $set) {
                                $set('value', null);
                                $set('link_url', null);  // Reset link URL when field type changes
                            }),

                        // Dynamic Meta Value field based on field_type
                        Forms\Components\Group::make()
                            ->schema(function ($get) {
                                $fieldType = $get('type');

                                return match ($fieldType) {
                                    'html' => self::html(),
                                    'text' => self::text(),
                                    'textarea' => self::textarea(),
                                    'image' => self::files(),
                                    'links' => self::links(),
                                    default => [],
                                };
                            }),
                        
                    ])
                    ->collapsible() // Enables collapsing of individual repeater items
                    ->collapsed() // Makes the items collapsed by default
                    ->columnSpanFull()
                    ->label('Widget')
                    ->hidden(fn(Forms\Get $get) => !$get('has_widgets')),
            ]);
    }



    public static function text(){
        return [
            Forms\Components\TextInput::make('value')
                ->label('Text Value')
                ->required(),
           
        ];
    }

    public static function html(){
        return [
            Forms\Components\RichEditor::make('value')
                ->required(),
        ];
    }

    public static function textarea()
    {
       return  [
            Forms\Components\Textarea::make('value')
                ->label('Content')
                ->required(),
           
        ];
    }

    public static function files(){
        return [
            Forms\Components\FileUpload::make('value')
                ->label('Image')
                ->image()
                ->required(),
            
        ];
    }

    public static function links(){
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
