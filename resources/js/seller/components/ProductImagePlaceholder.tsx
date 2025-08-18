import { FC } from 'react';

interface ProductImagePlaceholderProps {
	className?: string;
	text?: string;
}

const ProductImagePlaceholder: FC<ProductImagePlaceholderProps> = ({ 
	className = '', 
	text = 'No Image' 
}) => {
	return (
		<div className={`relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex flex-col items-center justify-center overflow-hidden ${className}`}>
			<div className="absolute inset-0 placeholder-shimmer" />
			<svg className="relative w-10 h-10 text-blue-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
				<path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2H4zm16 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM7 10l2.5 3L12 9.5 17 16H5l2-6z" clipRule="evenodd" />
			</svg>
			<span className="relative text-blue-400 dark:text-gray-500 text-xs font-medium mt-1">
				{text}
			</span>
		</div>
	);
};

export default ProductImagePlaceholder;