<?php

namespace App\Modules\CustomerManagement;

use App\Modules\BaseModule;

class CustomerManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'CustomerManagement';
    }

    public function getDescription(): string
    {
        return 'Manages customer operations including creation, updates, and customer relationship management';
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