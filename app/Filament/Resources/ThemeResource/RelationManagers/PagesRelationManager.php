<?php

namespace App\Filament\Resources\ThemeResource\RelationManagers;

use App\Models\PageType;
use App\Models\Widget;
use App\Models\WidgetType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PagesRelationManager extends RelationManager
{
    protected static string $relationship = 'pages';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('type')
                    ->label('Page Type')
                    ->options(PageType::all()->pluck('type', 'id')) // Fetch widget types from the database
                    ->searchable()
                    ->required(),
                Forms\Components\Select::make('layout_id')
                    ->label('Layout')
                    ->options(Widget::all()->pluck('label', 'id')) // Fetch widget types from the database
                    ->searchable()
                    ->required(),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(1000)
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('thumbnail')
                    ->label('Thumbnail URL')
                    ->columnSpanFull()
                    ->nullable()
                    ->columnSpanFull(),

                Forms\Components\Repeater::make('widgets')
                    ->relationship('page_widgets')
                    ->schema([
                        Forms\Components\TextInput::make('name')->label('Name')->placeholder('e.g. heroSection')->required()->hint('e.g., Header, Navbar, Contact Form'),
                        Forms\Components\TextInput::make('label')->label('Label')->placeholder('e.g. Hero Section')->required(),
                        Forms\Components\Select::make('widget_type_id')
                            ->label('Widget Type')
                            ->options(WidgetType::all()->pluck('type', 'id')) // Fetch widget types from the database
                            ->searchable()
                            ->required(),
                        Forms\Components\Textarea::make("inputs")
                            ->label("Inputs Array")
                            ->placeholder("ex. []")
                            ->rows(10)
                            ->placeholder('enter inputs array in json'),
                        Forms\Components\TextInput::make('thumbnail')
                            ->label('Thumbnail URL')
                            ->columnSpanFull()
                            ->nullable()
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('is_editable')
                            ->label('Is Editable')
                            ->default(true),

                    ])
                    ->reorderable()
                    ->collapsible()
                    ->collapsed()
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([Tables\Columns\TextColumn::make('name')])
            ->filters([
                //
            ])
            ->headerActions([Tables\Actions\CreateAction::make()])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }
}
