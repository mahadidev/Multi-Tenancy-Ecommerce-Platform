import React, { ComponentProps, Suspense, useEffect, useState } from 'react';

// Lazy load ApexChart component
const ApexChart = React.lazy(() => import('react-apexcharts'));

// Extract the props of the ApexChart component
type ApexChartProps = ComponentProps<typeof ApexChart>;

function Chart(props: ApexChartProps) {
	const [mounted, setMounted] = useState(false);

	// Only run this on the client side (after the first render)
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null; // Don't render anything until mounted (client-side)

	// Render the ApexChart wrapped with Suspense
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ApexChart {...props} width="100%" />
		</Suspense>
	);
}

export default Chart;
