<?php

namespace App\Modules\ContactManagement;

use App\Modules\BaseModule;

class ContactManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'ContactManagement';
    }

    public function getDescription(): string
    {
        return 'Manages contact forms, inquiries and customer communications';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function boot(): void
    {
        // Module boot logic
    }
}