/* eslint-disable react-hooks/rules-of-hooks */
import useExpense from '@seller/modules/Expense/hooks/useExpense';
import { Spinner } from 'flowbite-react';
import { FC, useMemo } from 'react';
import { HiCreditCard } from 'react-icons/hi';

interface ExpenseChartProps {
	className?: string;
}

const ExpenseChart: FC<ExpenseChartProps> = ({ className = '' }) => {
	const { expenses } = useExpense();
	const isExpensesLoading = false; // Default loading state since isLoading is not available

	// Loading state
	if (isExpensesLoading) {
		return (
			<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6 ${className}`}>
				<div className="flex items-center justify-center h-32">
					<div className="text-center">
						<Spinner size="lg" className="mb-3" />
						<p className="text-gray-500 dark:text-gray-400 text-sm">
							Loading expense data...
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Helper function to safely convert amount to number
	const safeAmount = (amount: any): number => {
		if (typeof amount === 'number' && !isNaN(amount)) {
			return amount;
		}
		if (typeof amount === 'string') {
			const parsed = parseFloat(amount);
			return isNaN(parsed) ? 0 : parsed;
		}
		return 0;
	};

	// Calculate expense metrics
	const expenseMetrics = useMemo(() => {
		if (!expenses || expenses.length === 0) {
			return {
				totalExpenses: 0,
				totalAmount: 0,
				averageExpense: 0,
				monthlyExpenses: 0,
				categories: 0
			};
		}

		const totalAmount = expenses.reduce((sum, expense) => {
			const amount = safeAmount(expense.amount);
			return sum + amount;
		}, 0);
		
		const totalExpenses = expenses.length;
		const averageExpense = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

		// Calculate current month expenses
		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();
		const monthlyExpenses = expenses.filter(expense => {
			try {
				const expenseDate = new Date(expense.created_at || expense.expense_date || new Date());
				return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
			} catch {
				return false;
			}
		}).reduce((sum, expense) => {
			const amount = safeAmount(expense.amount);
			return sum + amount;
		}, 0);

		// Count unique categories
		const uniqueCategories = new Set(
			expenses
				.map(expense => expense.category)
				.filter(category => category && category.trim() !== '')
		);

		return {
			totalExpenses,
			totalAmount,
			averageExpense,
			monthlyExpenses,
			categories: uniqueCategories.size
		};
	}, [expenses]);

	// Calculate expense efficiency (lower is better for expenses)
	const monthlyTarget = 50000; // Example monthly target
	const efficiencyScore = (() => {
		const monthlyExpenses = safeAmount(expenseMetrics.monthlyExpenses);
		const target = safeAmount(monthlyTarget);
		
		if (target <= 0) return 100; // If no target, efficiency is perfect
		if (monthlyExpenses <= 0) return 100; // If no expenses, efficiency is perfect
		
		const ratio = monthlyExpenses / target;
		return Math.max(0, Math.min(100, 100 - (ratio * 100)));
	})();

	const formatCurrency = (amount: number) => {
		// Handle NaN or invalid values
		const safeAmountValue = safeAmount(amount);
		
		try {
			return new Intl.NumberFormat('en-BD', {
				style: 'currency',
				currency: 'BDT',
				minimumFractionDigits: 0
			}).format(safeAmountValue).replace('BDT', '৳');
		} catch {
			// Fallback formatting if Intl.NumberFormat fails
			return `৳${safeAmountValue.toLocaleString()}`;
		}
	};

	return (
		<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${className}`}>
			{/* Minimal Header */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center space-x-2">
					<HiCreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<h3 className="text-base font-medium text-gray-900 dark:text-white">Expense Overview</h3>
				</div>
			</div>

			{/* Simple Metrics Grid */}
			<div className="p-4">
				<div className="grid grid-cols-2 gap-4">
					{/* Total Expenses */}
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-900 dark:text-white">
							{expenseMetrics.totalExpenses.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Total Expenses
						</div>
					</div>

					{/* Total Amount */}
					<div className="text-center">
						<div className="text-2xl font-bold text-red-600 dark:text-red-400">
							{formatCurrency(expenseMetrics.totalAmount)}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Total Amount
						</div>
					</div>

					{/* Monthly Expenses */}
					<div className="text-center">
						<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
							{formatCurrency(expenseMetrics.monthlyExpenses)}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							This Month
						</div>
					</div>

					{/* Categories */}
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
							{expenseMetrics.categories.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Categories
						</div>
					</div>
				</div>

				{/* Monthly Budget Progress */}
				<div className="mt-6">
					<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
						<span>Monthly Budget</span>
						<span>{formatCurrency(expenseMetrics.monthlyExpenses)} / {formatCurrency(monthlyTarget)}</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
						<div
							className={`h-2 rounded-full transition-all duration-300 ${
								(() => {
									const ratio = monthlyTarget > 0 ? (expenseMetrics.monthlyExpenses / monthlyTarget) : 0;
									if (ratio > 0.8) return 'bg-gradient-to-r from-red-500 to-red-600';
									if (ratio > 0.6) return 'bg-gradient-to-r from-orange-500 to-red-500';
									return 'bg-gradient-to-r from-green-500 to-yellow-500';
								})()
							}`}
							style={{
								width: `${Math.min(
									monthlyTarget > 0 
										? Math.max(0, (expenseMetrics.monthlyExpenses / monthlyTarget) * 100)
										: 0,
									100
								)}%`
							}}
						></div>
					</div>
					<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
						<span>Low</span>
						<span>Over Budget</span>
					</div>
				</div>

				{/* Cost Efficiency */}
				<div className="mt-4">
					<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
						<span>Cost Efficiency</span>
						<span>{isFinite(efficiencyScore) ? efficiencyScore.toFixed(0) : '0'}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
						<div
							className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
							style={{
								width: `${isFinite(efficiencyScore) ? Math.max(0, Math.min(100, efficiencyScore)) : 0}%`
							}}
						></div>
					</div>
					<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
						<span>Poor</span>
						<span>Excellent</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExpenseChart;
