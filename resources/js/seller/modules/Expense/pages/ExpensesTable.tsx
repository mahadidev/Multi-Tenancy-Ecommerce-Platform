import GenericTable from "@seller/components/DataTable/GenericTable";
import { useExpenseTable } from "../hooks";
import { ExpenseType } from "@type/expenseType";
import { Badge, Table } from "flowbite-react";
import CreateExpenseModal from "./CreateExpenseModal";
import DeleteExpenseModal from "./DeleteExpenseModal";
import EditExpenseModal from "./EditExpenseModal";
import { formatTableDate } from "@seller/_utils/dateUtils";

const ExpensesTable = () => {
    const expenseTable = useExpenseTable();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'failure';
            case 'pending': return 'warning';
            default: return 'info';
        }
    };

    return (
        <GenericTable
            table={expenseTable}
            columns={[
                {
                    label: 'Expense Details',
                    key: 'title',
                    render: (row: ExpenseType) => (
                        <Table.Cell className="p-4">
                            <div className="min-w-0 flex-1">
                                <div className="font-semibold text-gray-900 dark:text-white truncate">
                                    {row.title}
                                </div>
                                {row.description && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {row.description}
                                    </div>
                                )}
                            </div>
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: 'Amount',
                    key: 'amount',
                    render: (row: ExpenseType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            <span className="font-semibold text-green-600 dark:text-green-400">
                                {row.formatted_amount}
                            </span>
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: 'Category',
                    key: 'category',
                    render: (row: ExpenseType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {row.category_label}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: 'Payment Method',
                    key: 'payment_method',
                    render: (row: ExpenseType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {row.payment_method_label}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: 'Date',
                    key: 'expense_date',
                    render: (row: ExpenseType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {row.expense_date_formatted}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: 'Status',
                    key: 'status',
                    render: (row: ExpenseType) => (
                        <Table.Cell className="whitespace-nowrap p-4">
                            <Badge color={getStatusColor(row.status)} size="sm">
                                {row.status_label}
                            </Badge>
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: 'Vendor',
                    key: 'vendor',
                    render: (row: ExpenseType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            <div>
                                <div className="font-medium">{row.vendor?.name || '-'}</div>
                                {row.vendor?.phone && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {row.vendor.phone}
                                    </div>
                                )}
                            </div>
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: 'Created At',
                    key: 'created_at',
                    render: (row: ExpenseType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {formatTableDate(row.created_at)}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: 'Actions',
                    render: (row: ExpenseType) => (
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditExpenseModal expense={row} />
                                <DeleteExpenseModal expense={row} />
                            </div>
                        </Table.Cell>
                    ),
                },
            ]}
            search={{
                placeholder: "Search expenses by title, category, vendor...",
                columns: ["title", "description", "category", "payment_method", "vendor"],
            }}
            head={{
                render: (_data: ExpenseType[]) => <CreateExpenseModal />,
            }}
            exportable={true}
            filename="expenses"
            defaultSortBy="created_at"
            defaultSortOrder="desc"
            defaultPerPage={10}
        />
    );
};

export default ExpensesTable;