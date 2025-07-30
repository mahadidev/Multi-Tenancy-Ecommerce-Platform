import useOrders from "@seller/hooks/useOrders";
import { useState } from "react";
import SalesApexChart from "./SalesApexChart";

const SalesChart = () => {
	const [range, ] = useState<'today' | 'week' | 'month' | 'year'>(
		'week'
	);
	const { report: orderReport } = useOrders({reportFilterRange: range});

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
			</div>
		</>
	);
};
export default SalesChart;
