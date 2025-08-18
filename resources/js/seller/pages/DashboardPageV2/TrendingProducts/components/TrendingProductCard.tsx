import { Card } from 'flowbite-react';
import { ReactNode } from 'react';

interface TrendingProductCardProps {
	children: ReactNode;
	className?: string;
}

const TrendingProductCard: React.FC<TrendingProductCardProps> = ({ children, className = "" }) => {
	return (
		<Card className={`border-0 relative h-full ${className}`}>
			{children}
		</Card>
	);
};

export default TrendingProductCard;