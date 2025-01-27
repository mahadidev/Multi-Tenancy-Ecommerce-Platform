import { FC } from "react";

const ErrorMessage:FC<{children: React.ReactNode}> = ({children}) => {
  return (
		<>
			{children && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{children}</p>}
		</>
	);
}
export default ErrorMessage
