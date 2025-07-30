import { FC } from 'react';
import OrderReportChart from './OrderCharts/OrderReportChart';
import ProductStockHistoryChart from './ProductCharts/ProductStockHistoryChart';

const DashboardPage: FC = () => {
	return (
		<div className="p-4 flex flex-col gap-6">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				<OrderReportChart />
				<ProductStockHistoryChart />
			</div>
		</div>
	);
};

export default DashboardPage;
