import useExpense from "@seller/_hooks/useExpense";
import { DataTable } from "@seller/components";
import { ExpenseType } from "@type/expenseType";
import { Badge, Table } from "flowbite-react";
import CreateExpenseModal from "./CreateExpenseModal";
import DeleteExpenseModal from "./DeleteExpenseModal";
import EditExpenseModal from "./EditExpenseModal";

const ExpensesTable = () => {
    const { expenses } = useExpense();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'failure';
            case 'pending': return 'warning';
            default: return 'info';
        }
    };

    return (
			<>
				<DataTable
					columns={[
						{
							label: 'Title',
							key: 'title',
							render: (row: ExpenseType) => (
								<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
									<div>
										<div className="font-medium">{row.title}</div>
										{row.description && (
											<div className="text-sm text-gray-500 dark:text-gray-400">
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
									{row.created_at_human}
								</Table.Cell>
							),
							sortable: true,
						},
						{
							label: 'Actions',
							key: 'actions',
							render: (row: ExpenseType) => (
								<Table.Cell className="whitespace-nowrap p-4">
									<div className="flex items-center space-x-2">
										<EditExpenseModal expense={row} />
										<DeleteExpenseModal expense={row} />
									</div>
								</Table.Cell>
							),
						},
					]}
					data={expenses}
					head={{
						render: () => <CreateExpenseModal />,
					}}
				/>
			</>
		);
};

export default ExpensesTable;
