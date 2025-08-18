import React, { useState } from 'react';
import { Card, Badge, Tabs } from 'flowbite-react';
import { 
	HiTrendingUp, 
	HiTrendingDown, 
	HiShoppingCart, 
	HiCurrencyDollar,
	HiChartPie,
	HiEye,
	HiRefresh
} from 'react-icons/hi';
import useSalesChart from '@seller/hooks/useSalesChart';

interface MetricCardProps {
	title: string;
	value: string | number;
	change: number;
	changeLabel: string;
	icon: React.ElementType;
	color: 'green' | 'blue' | 'purple' | 'red' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
	title, 
	value, 
	change, 
	changeLabel, 
	icon: Icon, 
	color 
}) => {
	const colorClasses = {
		green: 'from-green-400 to-green-600',
		blue: 'from-blue-400 to-blue-600', 
		purple: 'from-purple-400 to-purple-600',
		red: 'from-red-400 to-red-600',
		yellow: 'from-yellow-400 to-yellow-600'
	};

	const isPositive = change >= 0;

	return (
		<Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
			<div className="flex items-center justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
						{title}
					</p>
					<p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						{typeof value === 'number' ? value.toLocaleString() : value}
					</p>
					<div className="flex items-center space-x-2">
						<div className={`flex items-center space-x-1 text-sm ${
							isPositive 
								? 'text-green-600 dark:text-green-400' 
								: 'text-red-600 dark:text-red-400'
						}`}>
							{isPositive ? (
								<HiTrendingUp className="w-4 h-4" />
							) : (
								<HiTrendingDown className="w-4 h-4" />
							)}
							<span className="font-medium">
								{isPositive ? '+' : ''}{change}%
							</span>
						</div>
						<span className="text-xs text-gray-500 dark:text-gray-400">
							{changeLabel}
						</span>
					</div>
				</div>
				<div className={`p-4 rounded-full bg-gradient-to-r ${colorClasses[color]} shadow-lg`}>
					<Icon className="w-8 h-8 text-white" />
				</div>
			</div>
		</Card>
	);
};

const AnalyticsOverview: React.FC = () => {
	const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('week');
	const { report: salesReport, isLoading } = useSalesChart({ reportFilterRange: timeRange });

	// Mock data - replace with real data from your API
	const metrics = [
		{
			title: 'Total Revenue',
			value: `৳${salesReport?.total_revenue?.toLocaleString() || '0'}`,
			change: 12.5,
			changeLabel: 'vs last period',
			icon: HiCurrencyDollar,
			color: 'green' as const
		},
		{
			title: 'Total Orders',
			value: salesReport?.total_orders || 0,
			change: 8.2,
			changeLabel: 'vs last period',
			icon: HiShoppingCart,
			color: 'blue' as const
		},
		{
			title: 'Conversion Rate',
			value: '3.2%',
			change: -2.1,
			changeLabel: 'vs last period',
			icon: HiChartPie,
			color: 'purple' as const
		},
		{
			title: 'Page Views',
			value: '24,567',
			change: 15.3,
			changeLabel: 'vs last period',
			icon: HiEye,
			color: 'yellow' as const
		}
	];

	const timeRanges = [
		{ label: 'Today', value: 'today' },
		{ label: 'This Week', value: 'week' },
		{ label: 'This Month', value: 'month' },
		{ label: 'This Year', value: 'year' }
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						Analytics Overview
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Monitor your store's key performance indicators
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<Tabs.Group>
						{timeRanges.map((range) => (
							<Tabs.Item
								key={range.value}
								active={timeRange === range.value}
								title={range.label}
								onClick={() => setTimeRange(range.value as any)}
							/>
						))}
					</Tabs.Group>
					<button 
						className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
						onClick={() => window.location.reload()}
					>
						<HiRefresh className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Metrics Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{metrics.map((metric, index) => (
					<MetricCard
						key={index}
						{...metric}
					/>
				))}
			</div>

			{/* Additional Insights */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="border-0 shadow-lg">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Top Performing Categories
						</h3>
						<Badge color="info" size="sm">Live</Badge>
					</div>
					<div className="space-y-4">
						{['Electronics', 'Clothing', 'Books', 'Home & Garden'].map((category, index) => (
							<div key={index} className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									<span className="text-gray-700 dark:text-gray-300">{category}</span>
								</div>
								<div className="flex items-center space-x-2">
									<span className="text-sm font-medium text-gray-900 dark:text-white">
										৳{(Math.random() * 50000).toFixed(0)}
									</span>
									<span className="text-xs text-green-600 dark:text-green-400">
										+{(Math.random() * 20).toFixed(1)}%
									</span>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card className="border-0 shadow-lg">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Recent Activity
						</h3>
						<Badge color="success" size="sm">Updated</Badge>
					</div>
					<div className="space-y-4">
						{[
							{ action: 'New order received', time: '2 minutes ago', value: '৳1,250' },
							{ action: 'Product added', time: '15 minutes ago', value: 'iPhone 15 Pro' },
							{ action: 'Customer registered', time: '1 hour ago', value: 'john@example.com' },
							{ action: 'Payment processed', time: '2 hours ago', value: '৳3,500' }
						].map((activity, index) => (
							<div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{activity.action}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{activity.time}
									</p>
								</div>
								<span className="text-sm font-medium text-blue-600 dark:text-blue-400">
									{activity.value}
								</span>
							</div>
						))}
					</div>
				</Card>
			</div>
		</div>
	);
};

export default AnalyticsOverview;