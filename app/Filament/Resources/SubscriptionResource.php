<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubscriptionResource\Pages;
use App\Filament\Resources\SubscriptionResource\RelationManagers;
use App\Models\Subscription;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Checkbox;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BooleanColumn;
use Filament\Forms\Components\Card;
use Filament\Tables\Columns\ToggleColumn;

class SubscriptionResource extends Resource
{

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $model = Subscription::class;

    protected static ?string $navigationGroup = 'Settings';

    protected static ?int $navigationSort = 7;

    public static function form(Form $form): Form
    {

        return $form
        ->schema([
            // Subscription Info Card
            Card::make()
                ->schema([
                    TextInput::make('name')
                        ->label('Subscription Name')
                        ->required()
                        ->maxLength(255)
                        ->placeholder('Enter subscription name')
                        ->helperText('This will be the name of the subscription plan.')
                        ->columnSpan(2),
                    
                    TextInput::make('title')
                        ->label('Subscription Title')
                        ->required()
                        ->maxLength(255)
                        ->placeholder('Enter subscription title')
                        ->helperText('A short description of the plan.')
                        ->columnSpan(2),
                    
                    TextInput::make('price_monthly')
                        ->label('Price per Month')
                        ->required()
                        ->numeric()
                        ->placeholder('Enter price')
                        ->helperText('The cost of this subscription per month.')
                        ->columnSpan(2),
                    
                    Checkbox::make('is_trend')
                        ->label('Is Trending')
                        ->helperText('Mark if this plan is featured or trending.')
                        ->columnSpan(1),
                    Checkbox::make('is_visible')
                        ->label('Is Visible')
                        ->helperText('Mark if this plan is visible in site.')
                        ->columnSpan(1),
                ])
                ->columns(2)
                ->heading('Subscription Information')
                ->description('Provide the basic information about the subscription plan.'),
            
            // Subscription Features Card
            Card::make()
                ->schema([
                    Forms\Components\Repeater::make('features')
                        ->relationship('features')
                        ->schema([
                            TextInput::make('name')
                                ->label('Feature Name')
                                ->required()
                                ->placeholder('Enter feature name')
                                ->helperText('What feature does this plan offer?'),
                            
                            Checkbox::make('is_available')
                                ->label('Is Available')
                                ->helperText('Mark if this feature is available in the subscription.'),
                        ])
                        ->columns(2)
                        ->createItemButtonLabel('Add Feature')
                        ->label('Subscription Features'),
                ])
                ->columns(1)
                ->heading('Manage Features')
                ->description('Define features available for this subscription. You can add multiple features.'),
        ]);
       
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Subscription Plan')
                    ->sortable(),
                TextColumn::make('price_monthly')
                    ->label('Price per Month')
                    ->sortable(),
                ToggleColumn::make('is_trend')
                    ->label('Is Trending')
                    ->sortable(),

                ToggleColumn::make('is_visible') // Use ToggleColumn for visibility
                    ->label('Is Visible')
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
            'index' => Pages\ListSubscriptions::route('/'),
            'create' => Pages\CreateSubscription::route('/create'),
            'edit' => Pages\EditSubscription::route('/{record}/edit'),
        ];
    }
}
