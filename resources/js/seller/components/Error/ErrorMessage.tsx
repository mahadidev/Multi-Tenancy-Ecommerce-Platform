import { FC, HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

const ErrorMessage: FC<Props> = ({ children, className, ...rest }) => {
	return (
		<>
			{children && (
				<p className={`${className} mt-2 text-sm text-red-600 dark:text-red-500`}
                {...rest}>
					{children}
				</p>
			)}
		</>
	);
};
export default ErrorMessage;
