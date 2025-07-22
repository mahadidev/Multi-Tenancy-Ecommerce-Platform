import useDashboardAnalytics from '@seller/hooks/useDashboradAnalytics';
import { Card } from 'flowbite-react';

const OverviewCards = () => {
	const { analytics } = useDashboardAnalytics();

	return (
		<div className="grid grid-cols-4 gap-4">
			<Card className='p-0.5'>
				<div>
					<h2 className="text-sm">Total Product Valuation</h2>
					<p className="text-2xl font-bold text-primary mt-2.5">
						{analytics?.product.valuation.total} TK.
					</p>
				</div>
			</Card>
		</div>
	);
};
export default OverviewCards;
