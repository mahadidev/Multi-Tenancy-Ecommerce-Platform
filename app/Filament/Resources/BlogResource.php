<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BlogResource\Pages;
use App\Filament\Resources\BlogResource\RelationManagers;
use App\Models\Blog;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\RichEditor;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Tabs\Tab;
use Filament\Tables\Columns\CheckboxColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Columns\IconColumn;

class BlogResource extends Resource
{
    protected static ?string $model = Blog::class;

    protected static ?string $navigationGroup = 'Blog Section';

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?int $navigationSort = 2;

    public static function getNavigationSort(): ?int
    {
        return 3; // Assign a sort order for Blog Section
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make([
                    TextInput::make('title')->required(),
                    Forms\Components\Grid::make(2)
                        ->schema([
                            Select::make('category_id')
                                ->label('Category')
                                ->options(Category::all()->where('type', 'post')->pluck('name', 'id'))
                                ->required(),
                            Select::make('status')
                                ->label('Status')
                                ->options([
                                    'active' => 'Active',
                                    'inactive' => 'Inactive',
                                ])
                                ->default('active')
                                ->required(),
                        ]),

                ])->columnSpan(7),

                Forms\Components\Card::make([
                    FileUpload::make('image')
                        ->disk('public')
                        ->directory('blogs'),

                ])->columnSpan(5),

                Forms\Components\Card::make([
                    RichEditor::make('content')->required(),
                ])->columnSpan(12),
            ])->columns(12);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image'),
                TextColumn::make('title')->searchable(),
                TextColumn::make('category.name'),

                IconColumn::make('status')
                    ->icon(fn(string $state): string => match ($state) {
                        'active' => 'heroicon-o-check-circle',
                        'inactive' => 'heroicon-o-clock',
                    })
                    ->color(fn(string $state): string => match ($state) {
                        'inactive' => 'warning',
                        'active' => 'success',
                        default => 'success',
                    })

            ])
            ->filters([
                SelectFilter::make('category')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->multiple()
                    ->preload()
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
            'index' => Pages\ListBlogs::route('/'),
            'create' => Pages\CreateBlog::route('/create'),
            'edit' => Pages\EditBlog::route('/{record}/edit'),
        ];
    }
}
