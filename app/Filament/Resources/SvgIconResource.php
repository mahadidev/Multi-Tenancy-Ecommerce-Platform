<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SvgIconResource\Pages;
use App\Filament\Resources\SvgIconResource\RelationManagers;
use App\Models\SvgIcon;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SvgIconResource extends Resource
{
    protected static ?string $model = SvgIcon::class;

    // protected static ?string $navigationIcon = 'heroicon-o-collection';
    protected static ?string $navigationIcon = 'heroicon-o-shield-check';
    protected static ?string $navigationLabel = 'SVG Icons';
    protected static ?string $pluralLabel = 'SVG Icons';

    protected static ?string $navigationGroup = 'Settings';

    public static function getNavigationSort(): ?int
    {
        return 4;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make([
                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\Grid::make()
                        ->schema([
                            Forms\Components\Textarea::make('icon')
                                ->required()
                                ->maxLength(1000)
                                ->helperText('Paste your SVG code here')
                                ->reactive()
                                ->rows(8)
                                ->columnSpan(1),

                            Forms\Components\Section::make('Preview')
                                ->schema([
                                    Forms\Components\Placeholder::make('')
                                        ->content(function ($get) {
                                            $svg = $get('icon');
                                            if (empty($svg)) {
                                                return new \Illuminate\Support\HtmlString(
                                                    '<div class="text-gray-400 text-center p-4">
                                                        SVG preview will appear here
                                                    </div>'
                                                );
                                            }
                                            return new \Illuminate\Support\HtmlString(
                                                '<div class="bg-black border border-gray-200 rounded-lg p-6 shadow-sm">
                                                    <div class="flex items-center justify-center" style="min-height: 200px;">
                                                        <div style="width: 150px; height: 150px;" class="flex items-center justify-center">
                                                            ' . $svg . '
                                                        </div>
                                                    </div>
                                                </div>'
                                            );
                                        })
                                ])
                                ->collapsible(false)
                                ->columnSpan(1),
                        ])
                        ->columns(2),
                ])->columns(1),
            ]);
    }
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\ViewColumn::make('icon')
                    ->view('components.svg-preview')
                    ->label('Preview'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListSvgIcons::route('/'),
            'create' => Pages\CreateSvgIcon::route('/create'),
            'edit' => Pages\EditSvgIcon::route('/{record}/edit'),
        ];
    }
}
