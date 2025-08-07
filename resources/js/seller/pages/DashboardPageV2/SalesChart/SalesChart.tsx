import useOrders from '@seller/hooks/useOrders';
import { Dropdown, DropdownItem } from 'flowbite-react';
import { FC, useState } from 'react';
import SalesApexChart from './SalesApexChart';

const SalesChart = () => {
	const rangeList = [
		{
			label: 'Today',
			value: 'today',
		},
		{
			label: 'Week',
			value: 'week',
		},
		{
			label: 'Month',
			value: 'month',
		},
		{
			label: 'Year',
			value: 'year',
		},
	];
	const [range, setRange] = useState<'today' | 'week' | 'month' | 'year'>('today');
	const { report: orderReport } = useOrders({ reportFilterRange: range });

	return (
		<>
			<div className="xl:col-span-2 rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
				<div className="mb-4 flex items-center justify-between">
					<div className="shrink-0">
						<span className="text-2xl leading-none font-bold text-gray-900 sm:text-3xl dark:text-white">
							TK {orderReport && Math.floor(orderReport.total_revenue)}
						</span>
						<h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
							Sales this {orderReport?.period}
						</h3>
					</div>
					<div className="flex flex-1 items-center justify-end text-base font-bold text-green-500 dark:text-green-400">
						45%
						<svg
							className="h-5 w-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
				<SalesApexChart />

				<div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 sm:pt-6 dark:border-gray-700">
					<DateRangeDropdown
						defaultValue={{
							label: range.toUpperCase(),
							value: range,
						}}
						onChange={setRange}
						list={rangeList}
					/>
					{/* <div className="shrink-0">
						<a
							href="#"
							className="text-primary-700 dark:text-primary-500 inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase hover:bg-gray-100 sm:text-sm dark:hover:bg-gray-700"
						>
							Sales Report
							<svg
								className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</div> */}
				</div>
			</div>
		</>
	);
};
export default SalesChart;

const DateRangeDropdown: FC<{
	onChange: CallableFunction;
	list: {
		label: string;
		value: string;
	}[];
    defaultValue: {
        label: string;
        value: string;
    }
}> = ({ defaultValue, onChange, list }) => {
	return (
		<span className="p-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
			<Dropdown inline label={defaultValue.label}>
				{/* <DropdownItem>
					<strong>Sep 16, 2021 - Sep 22, 2021</strong>
				</DropdownItem> */}
				{/* <DropdownDivider /> */}
				{list.map((item, index) => (
					<DropdownItem key={index} onClick={() => onChange(item.value)}>
						{item.label}
					</DropdownItem>
				))}
			</Dropdown>
		</span>
	);
};
