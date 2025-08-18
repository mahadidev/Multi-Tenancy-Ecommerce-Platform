import { Spinner } from 'flowbite-react';
import { FC, useEffect, useRef, useState } from 'react';
import { HiCheck, HiSelector } from 'react-icons/hi';
import { DateRangeDropdownProps, RangeType } from '../types';

const DateRangeDropdown: FC<DateRangeDropdownProps> = ({
	currentValue,
	onChange,
	list,
	isLoading = false
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleEscapeKey);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [isOpen]);

	const handleItemClick = (item: { label: string; value: string }) => {
		onChange(item.value as RangeType);
		setIsOpen(false);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			setIsOpen(!isOpen);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center space-x-2">
				<Spinner size="sm" />
				<span className="text-sm text-gray-600 dark:text-gray-400">
					{currentValue.label}
				</span>
			</div>
		);
	}

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={handleKeyDown}
				className="group flex items-center justify-between min-w-[140px] px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<span className="truncate">{currentValue.label}</span>
				<HiSelector className={`ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
			</button>

			{isOpen && (
				<>
					<div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
					<div className="absolute left-0 top-[110%] z-50 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none">
						<div className="py-1" role="listbox">
							{list.map((item, index) => (
								<button
									key={index}
									onClick={() => handleItemClick(item)}
									className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150 ${
										item.value === currentValue.value
											? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
											: 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
									}`}
									role="option"
									aria-selected={item.value === currentValue.value}
								>
									<span className="font-medium">{item.label}</span>
									{item.value === currentValue.value && (
										<HiCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
									)}
								</button>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DateRangeDropdown;
