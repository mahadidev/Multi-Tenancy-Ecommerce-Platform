import { Link } from 'react-router-dom';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'gray'; // Custom prop example
	size?: 'sm' | 'md';
	href?: string;
	to?: string;
};

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
	const variants = {
		primary:
			'text-white bg-[var(--primary-700)] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300',
		gray:
			'text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-primary-300',
	};

	const sizes = {
		sm: 'font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5',
		md: 'font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5',
	};

	return (
		<>
			{!props.href && !props.to && (
				<button
					className={`${variants[props.variant ?? 'primary']} ${
						sizes[props.size ?? 'md']
					} focus:outline-none ${className}`}
					{...props}
				>
					{props.children}
				</button>
			)}
			{props.to && (
				<Link to={props.to}>
					<button
						className={`${variants[props.variant ?? 'primary']} ${
							sizes[props.size ?? 'md']
						} focus:outline-none ${className}`}
						{...props}
					>
						{props.children}
					</button>
				</Link>
			)}
			{props.href && (
				<a>
					<button
						className={`${variants[props.variant ?? 'primary']} ${
							sizes[props.size ?? 'md']
						} focus:outline-none ${className}`}
						{...props}
					>
						{props.children}
					</button>
				</a>
			)}
		</>
	);
};
