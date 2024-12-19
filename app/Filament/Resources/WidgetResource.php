<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WidgetResource\Pages;
use App\Filament\Resources\WidgetResource\RelationManagers;
use App\Models\WidgetGroup;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use App\Filament\Clusters\Widget as ClustersWidget;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;

class WidgetResource extends Resource
{
    protected static ?string $model = WidgetGroup::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationLabel = 'Widgets';
    protected static ?string $pluralLabel = 'Widgets';

    protected static ?string $navigationGroup = 'Settings';
   
    public static function getNavigationSort(): ?int
    {
        return 4; // Assign a sort order for User Management
    }
   
    public static function form(Form $form): Form
    {
        return $form
        ->schema([
            Forms\Components\Section::make('Widget Group Details')
                ->schema([
                    Forms\Components\TextInput::make('group_name')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\TextInput::make('group_label')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\TextInput::make('location')
                        ->maxLength(255),
                ]),

            Forms\Components\Section::make('Widgets')
                ->schema([
                    Forms\Components\Repeater::make('widgets')
                        ->relationship()
                        ->schema([
                            Forms\Components\TextInput::make('meta_title')
                                ->required()
                                ->live(onBlur: true)
                                ->maxLength(255),
                            Forms\Components\TextInput::make('meta_name')
                                ->required()
                                ->maxLength(255),
                            Forms\Components\Select::make('field_type')
                                ->label('Field Type')
                                ->options([
                                    'text' => 'Text Field',
                                    'textarea' => 'Textarea Field',
                                    'image' => 'Image Upload',
                                    'links' => 'Links',
                                ])
                                ->required()
                                ->live()
                                ->afterStateUpdated(function ($state, callable $set) {
                                    $set('meta_value', null);
                                    $set('link_url', null);  // Reset link URL when field type changes
                                }),

                            // Dynamic Meta Value field based on field_type
                            Forms\Components\Group::make()
                                ->schema(function ($get) {
                                    $fieldType = $get('field_type');

                                    return match ($fieldType) {
                                        'text' => self::text(),
                                        'textarea' => self::textarea(),
                                        'image' => self::files(),
                                        'links' => self::links(),
                                        default => [],
                                    };
                                }),
                            Forms\Components\Toggle::make('is_active')
                                ->default(true),
                            Forms\Components\KeyValue::make('settings')
                                ->label('Additional Settings'),
                        ])
                        ->orderColumn('sorting')
                        ->defaultItems(0)
                        ->reorderable()
                        ->collapsible()
                        ->collapsed()
                        ->itemLabel(fn (array $state): ?string => $state['meta_title'] ?? ''),
                ]),
        ]);
    }

    public static function text(){
        return [
            Forms\Components\TextInput::make('meta_value')
                ->label('Text Value')
                ->required(),
            Forms\Components\TextInput::make('placeholder')
                ->label('Placeholder'),
        ];
    }

    public static function textarea()
    {
       return  [
            Forms\Components\Textarea::make('meta_value')
                ->label('Content')
                ->required(),
            Forms\Components\TextInput::make('placeholder')
                ->label('Placeholder'),
        ];
    }

    public static function files(){
        return [
            Forms\Components\FileUpload::make('meta_value')
                ->label('Image')
                ->image()
                ->required(),
            Forms\Components\TextInput::make('alt_text')
                ->label('Alt Text'),
        ];
    }

    public static function links(){
        return [
            Forms\Components\Grid::make(2)
                ->schema([
                    Forms\Components\TextInput::make('meta_value')
                        ->label('Link Label')
                        ->required()
                        ->placeholder('Enter link text'),
                    Forms\Components\TextInput::make('link_url')
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
            TextColumn::make('group_name')
                ->label('Group Name')
                ->sortable()
                ->searchable(),
            TextColumn::make('group_label')
                ->label('Group Label')
                ->sortable()
                ->searchable(),
            TextColumn::make('location'),
            TextColumn::make('widgets_count')->counts('widgets'),
            TextColumn::make('created_at')
                ->label('Created At')
                ->dateTime(),
        ])
        ->filters([
            //
        ])
        ->actions([
            Tables\Actions\EditAction::make()->label('Manage'),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListWidgets::route('/'),
            'create' => Pages\CreateWidget::route('/create'),
            'edit' => Pages\EditWidget::route('/{record}/edit'),
        ];
    }
}
