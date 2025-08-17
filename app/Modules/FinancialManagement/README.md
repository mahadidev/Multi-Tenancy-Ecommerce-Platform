# Financial Management Module - Expense Management

This module provides comprehensive expense management functionality for sellers to track and manage their store expenses.

## Features

### ✅ Backend Features
- **Complete CRUD Operations** - Create, Read, Update, Delete expenses
- **Advanced Filtering** - Filter by category, status, date range, search terms
- **File Attachments** - Upload and manage receipts/documents (max 5 files, 2MB each)
- **Status Management** - Pending, Approved, Rejected status workflow
- **Statistics & Analytics** - Comprehensive expense reporting
- **Categorization** - 15 predefined categories (office supplies, marketing, rent, etc.)
- **Payment Methods** - Multiple payment method tracking (cash, card, bank transfer, etc.)
- **Store-specific** - All expenses are scoped to the authenticated store
- **User Tracking** - Track who created each expense

### ✅ Frontend Features
- **Modern React UI** - Built with TypeScript and Ant Design
- **Real-time Statistics** - Dashboard with expense summaries
- **Advanced Filters** - Category, status, date range, and text search
- **Inline Status Updates** - Quick status changes from the table
- **File Upload Support** - Drag & drop file attachments
- **Responsive Design** - Works on all device sizes
- **Export Functionality** - Export expenses to various formats

## API Endpoints

### Base URL: `/api/v1/seller/expenses`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List expenses with filtering and pagination |
| POST | `/` | Create new expense |
| GET | `/{id}` | Get single expense |
| PUT | `/{id}` | Update expense |
| DELETE | `/{id}` | Delete expense |
| PATCH | `/{id}/status` | Update expense status |
| GET | `/data/statistics` | Get expense statistics |
| GET | `/data/categories` | Get available categories |
| GET | `/data/payment-methods` | Get payment methods |
| POST | `/export` | Export expenses |

## Database Schema

### Expenses Table

```sql
CREATE TABLE expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    payment_method ENUM('cash','card','bank_transfer','check','other') DEFAULT 'cash',
    vendor VARCHAR(255) NULL,
    receipt_number VARCHAR(100) NULL,
    expense_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'approved',
    attachments JSON NULL,
    notes TEXT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_store_expense_date (store_id, expense_date),
    INDEX idx_store_category (store_id, category),
    INDEX idx_store_status (store_id, status)
);
```

## Usage Examples

### Creating an Expense

```php
use App\Modules\FinancialManagement\Models\Expense;

$expense = Expense::create([
    'store_id' => 1,
    'user_id' => auth()->id(),
    'title' => 'Office Supplies',
    'description' => 'Pens, papers, and printer ink',
    'amount' => 150.50,
    'category' => 'office_supplies',
    'payment_method' => 'card',
    'vendor' => 'Staples',
    'receipt_number' => 'REC-001',
    'expense_date' => '2025-01-15',
    'status' => 'approved',
]);
```

### Querying Expenses

```php
// Get all expenses for current month
$monthlyExpenses = Expense::forStore($storeId)
    ->currentMonth()
    ->with(['user', 'store'])
    ->get();

// Get expenses by category
$officeExpenses = Expense::forStore($storeId)
    ->byCategory('office_supplies')
    ->byStatus('approved')
    ->get();

// Get total expenses for date range
$total = Expense::getTotalForStore($storeId, $startDate, $endDate);

// Get expenses grouped by category
$byCategory = Expense::getByCategory($storeId, $startDate, $endDate);
```

### Frontend API Calls

```typescript
import { ExpenseAPI } from '@/services/expenseApi';

// Get expenses with filters
const expenses = await ExpenseAPI.getExpenses({
    category: 'office_supplies',
    status: 'approved',
    start_date: '2025-01-01',
    end_date: '2025-01-31',
    search: 'office',
    per_page: 20
});

// Create new expense
const newExpense = await ExpenseAPI.createExpense({
    title: 'Marketing Campaign',
    amount: 500.00,
    category: 'marketing',
    payment_method: 'card',
    expense_date: '2025-01-15',
    attachments: [file1, file2]
});

// Get statistics
const stats = await ExpenseAPI.getStatistics('2025-01-01', '2025-01-31');
```

## Available Categories

- `general` - General
- `office_supplies` - Office Supplies
- `marketing` - Marketing
- `rent` - Rent
- `utilities` - Utilities
- `transportation` - Transportation
- `meals` - Meals & Entertainment
- `equipment` - Equipment
- `software` - Software & Subscriptions
- `professional_services` - Professional Services
- `inventory` - Inventory
- `maintenance` - Maintenance & Repairs
- `insurance` - Insurance
- `taxes` - Taxes
- `other` - Other

## Available Payment Methods

- `cash` - Cash
- `card` - Credit/Debit Card
- `bank_transfer` - Bank Transfer
- `check` - Check
- `other` - Other

## Available Statuses

- `pending` - Pending approval
- `approved` - Approved expense
- `rejected` - Rejected expense

## File Attachments

- **Supported formats**: JPEG, PNG, PDF, DOC, DOCX
- **Maximum file size**: 2MB per file
- **Maximum files**: 5 files per expense
- **Storage**: Files are stored in `storage/app/public/expenses/`
- **Access**: Files are accessible via the API with full URLs

## Security Features

- **Authentication**: All endpoints require valid Sanctum token
- **Store Scoping**: Users can only access expenses from their authenticated store
- **File Validation**: Strict file type and size validation
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: All queries use Eloquent ORM

## Model Relationships

- **Store**: `belongsTo` - Each expense belongs to a store
- **User**: `belongsTo` - Each expense is created by a user
- **User.expenses**: `hasMany` - Users have many expenses
- **Store.expenses**: `hasMany` - Stores have many expenses

## Scopes Available

- `forStore($storeId)` - Filter by store
- `byStatus($status)` - Filter by status
- `byCategory($category)` - Filter by category
- `byDateRange($start, $end)` - Filter by date range
- `currentMonth()` - Current month expenses
- `currentYear()` - Current year expenses

## Helper Methods

- `isApproved()` - Check if expense is approved
- `isPending()` - Check if expense is pending
- `isRejected()` - Check if expense is rejected
- `approve()` - Approve the expense
- `reject()` - Reject the expense
- `getTotalForStore()` - Get total expenses for store
- `getByCategory()` - Get expenses grouped by category

## Installation & Setup

1. The migration is automatically loaded by the ModuleServiceProvider
2. Run migrations: `php artisan migrate`
3. The module is automatically registered and routes are loaded
4. Frontend components are ready to use with the provided TypeScript interfaces

## Module Structure

```
app/Modules/FinancialManagement/
├── Controllers/
│   └── ExpenseController.php          # Main CRUD controller
├── Database/
│   └── Migrations/
│       └── 2025_06_18_233825_create_expenses_table.php
├── Models/
│   └── Expense.php                    # Main expense model
├── Requests/
│   ├── StoreExpenseRequest.php        # Create validation
│   └── UpdateExpenseRequest.php       # Update validation
├── Resources/
│   ├── ExpenseResource.php            # API resource
│   └── ExpenseCollection.php          # Collection resource
├── Routes/
│   └── api.php                        # API routes
└── FinancialManagementModule.php      # Module definition
```

## Future Enhancements

- **Expense Categories Management** - Allow custom categories per store
- **Recurring Expenses** - Set up recurring expense templates
- **Budget Management** - Set and track budgets by category
- **Advanced Analytics** - Detailed expense analytics and trends
- **Tax Management** - Tax calculations and reporting
- **Multi-currency Support** - Support for multiple currencies
- **Expense Approval Workflow** - Multi-level approval system
- **Integration with Accounting Software** - QuickBooks, Xero integration
- **Mobile App Support** - Receipt scanning and mobile expense creation
- **Expense Policies** - Store-specific expense policies and limits