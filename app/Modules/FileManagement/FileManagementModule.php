<?php

namespace App\Modules\FileManagement;

use App\Modules\BaseModule;

class FileManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'FileManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Handles file uploads, storage, media management, and file operations';
    }

    public function boot(): void
    {
        // Register file-specific middleware and policies
    }

    public function register(): void
    {
        $this->app->singleton('file.service', function () {
            return new Services\FileService();
        });

        $this->app->singleton('media.service', function () {
            return new Services\MediaService();
        });
    }

    public function getConfig(): array
    {
        return [
            'max_file_size' => '10MB',
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
            'upload_path' => 'uploads',
            'enable_compression' => true,
        ];
    }

    public function getDependencies(): array
    {
        return [];
    }
}