<?php

namespace App\Modules\FinancialManagement;

use App\Modules\BaseModule;

class FinancialManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'FinancialManagement';
    }

    public function getDescription(): string
    {
        return 'Module for managing financial operations, expenses, and accounting';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }
}