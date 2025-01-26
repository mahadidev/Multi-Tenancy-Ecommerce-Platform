import { FC } from 'react';

const SteperItem = ({
	item,
	stepNum,
}: {
	item: { label: string; number: number };
	stepNum: number;
}) => {
	return (
		<>
			<li
				className={`flex items-center ${
					item.number < stepNum && 'text-primary-600 dark:text-light-500 '
				} after:mx-6 after:hidden after:h-1 after:w-12 after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] xl:after:mx-10 last:after:hidden`}
			>
				<div className="flex items-center after:mx-2 after:after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden md:flex-col">
					{item.number <= stepNum ? (
						<svg
							className="mr-2 h-4 w-4 shrink-0 sm:mx-auto sm:mb-2 sm:h-6 sm:w-6"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
					) : (
						<span className="mr-2 shrink-0 sm:mx-auto sm:mb-2 ">
							{item.number}
						</span>
					)}
					<span>{item.label}</span>
				</div>
			</li>
		</>
	);
};

interface PropsType {
	stepNum: number;
}

const StepHeader: FC<PropsType> = function (props) {
	return (
		<>
			<ol className="mb-6 flex justify-center items-center text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base lg:mb-12">
				{[
					{
						label: 'Basic Info',
						number: 1,
					},
					{
						label: 'Store Branding',
						number: 2,
					},
					{
						label: 'Theme Select',
						number: 3,
					},
				].map((item, index: number) => (
					<SteperItem stepNum={props.stepNum} item={item} key={index} />
				))}
			</ol>
		</>
	);
};

export default StepHeader;
