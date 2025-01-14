<?php

namespace App\Filament\Resources\FileStorageResource\Pages;

use App\Filament\Resources\FileStorageResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;


class EditFileStorage extends EditRecord
{
    protected static string $resource = FileStorageResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Set user_id if not provided
        if (empty($data['user_id'])) {
            $data['user_id'] = auth()->id();
        }

        $record = $this->getRecord();
    
        // Handle file upload and generate unique name
        if (isset($data['location']) && $data['location'] !== $record->location) {
            if ($record->location) {
                Storage::disk('public')->delete($record->location);
            }

            $uniqueName = uniqid() . '_' . time();
            $extension = pathinfo($data['location'], PATHINFO_EXTENSION);
            $newFileName = $uniqueName . '.' . $extension;
            
            // Rename the file in storage
            $storage = Storage::disk('public');
            $oldPath = $data['location'];
            $newPath = 'file_storage/' . $newFileName;
            
            if ($storage->exists($oldPath)) {
                $storage->move($oldPath, $newPath);
            }
            
            // Update location with new path
            $data['location'] = $newPath;
            
            // Set name field
            $data['name'] = $newFileName;
            
            // Set type based on extension
            $data['type'] = strtolower($extension) === 'pdf' ? 'pdf' : 'image';
        }
    
        return $data;
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
