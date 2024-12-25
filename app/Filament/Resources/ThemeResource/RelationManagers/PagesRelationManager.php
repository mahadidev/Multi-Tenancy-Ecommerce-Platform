<?php

namespace App\Filament\Resources\ThemeResource\RelationManagers;

use App\Models\ThemeWidget;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
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
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(1000)
                    ->columnSpanFull(),
                Forms\Components\Repeater::make('widgets')
                    ->relationship('page_widgets')
                    ->schema([
                        Forms\Components\Select::make('theme_widgets')
                            ->options(fn($livewire) => ThemeWidget::where('theme_id', $livewire->ownerRecord->id)->pluck("label", "id"))
                            ->preload()
                            ->live()
                            ->afterStateUpdated(function (Get $get, Set $set) {
                                $selectedWidget = ThemeWidget::where(["id" => $get("theme_widgets")])->first();

                                $set("name", $selectedWidget->name);
                                $set("label", $selectedWidget->label);
                                $set("inputs", $selectedWidget->inputs);
                            }),
                        Forms\Components\TextInput::make('name')
                            ->label('Name')
                            ->required()
                            ->hint('e.g., Header, Navbar, Contact Form'),
                        Forms\Components\TextInput::make('label')
                            ->label('Label')
                            ->required(),
                        Forms\Components\KeyValue::make("inputs")
                            ->keyLabel("Input Name")
                            ->keyPlaceholder("ex. Title")
                            ->valueLabel("Input arg.")
                            ->valuePlaceholder('ex. { "label": "Title", "value": "Welcome to Cholo Gori", "placeholder": "Enter your title", "required": "true" }')
                            ->reorderable()
                    ])
                    ->reorderable()
                    ->collapsible()
                    ->collapsed()
                    ->columnSpanFull()
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
