import { Button, Label } from 'flowbite-react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiChevronDown, HiPlus } from 'react-icons/hi';

interface Option {
    value: string | number;
    label: string;
}

interface QuickAddSelectProps {
	name: string;
	label?: string;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: Option[];
	placeholder?: string;
	onQuickAdd: (value: string) => Promise<{ id: string | number; name: string }>;
	required?: boolean;
	disabled?: boolean;
}

const QuickAddSelect: React.FC<QuickAddSelectProps> = ({
	name,
	label,
	value,
	onChange,
	options,
	placeholder = 'Select an option',
	onQuickAdd,
	required = false,
	disabled = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [isAdding, setIsAdding] = useState(false);

	// Animation variants
	const dropdownVariants: Variants = {
		hidden: {
			opacity: 0,
			y: -10,
			scale: 0.95,
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.2,
				ease: [0.4, 0, 0.2, 1],
			},
		},
		exit: {
			opacity: 0,
			y: -10,
			scale: 0.95,
			transition: {
				duration: 0.15,
				ease: [0.4, 0, 1, 1],
			},
		},
	};

	const createButtonVariants: Variants = {
		hidden: {
			opacity: 0,
			x: 20,
			scale: 0.8,
		},
		visible: {
			opacity: 1,
			x: 0,
			scale: 1,
			transition: {
				duration: 0.2,
				ease: [0.4, 0, 0.2, 1],
			},
		},
		exit: {
			opacity: 0,
			x: 20,
			scale: 0.8,
			transition: {
				duration: 0.15,
				ease: [0.4, 0, 1, 1],
			},
		},
	};

	const optionVariants: Variants = {
		hidden: {
			opacity: 0,
			y: -5,
		},
		visible: (index: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.2,
				delay: index * 0.03,
				ease: [0.4, 0, 0.2, 1],
			},
		}),
		exit: {
			opacity: 0,
			y: -5,
			transition: {
				duration: 0.15,
				ease: [0.4, 0, 1, 1],
			},
		},
	};

	const noResultsVariants: Variants = {
		hidden: {
			opacity: 0,
			scale: 0.95,
		},
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.3,
				ease: [0.4, 0, 0.2, 1],
			},
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			transition: {
				duration: 0.2,
				ease: [0.4, 0, 1, 1],
			},
		},
	};

	const containerRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Filter options based on search term
	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Show up to 10 options
	const displayOptions = filteredOptions.slice(0, 10);

	// Check if we should show create button (no results and search term exists)
	const showCreateButton = searchTerm.trim() && filteredOptions.length === 0;

	// Get selected option label for display
	const selectedOption = options.find((option) => option.value === value);
	const displayValue = selectedOption ? selectedOption.label : placeholder;

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setSearchTerm('');
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Focus search input when dropdown opens
	useEffect(() => {
		if (isOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isOpen]);

	const handleToggleDropdown = () => {
		if (disabled) return;
		setIsOpen(!isOpen);
		setSearchTerm('');
	};

	const handleOptionClick = (option: Option) => {
		// Create synthetic event to mimic select onChange
		const syntheticEvent = {
			target: {
				name,
				value: option.value.toString(),
			},
		} as React.ChangeEvent<HTMLSelectElement>;

		onChange(syntheticEvent);
		setIsOpen(false);
		setSearchTerm('');
	};

	const handleCreateNew = async () => {
		if (!searchTerm.trim() || isAdding) return;

		setIsAdding(true);
		try {
			const newOption = await onQuickAdd(searchTerm.trim());

			// Create synthetic event to select the new option
			const syntheticEvent = {
				target: {
					name,
					value: newOption.id.toString(),
				},
			} as React.ChangeEvent<HTMLSelectElement>;

			onChange(syntheticEvent);
			setIsOpen(false);
			setSearchTerm('');
		} catch (error) {
			console.error('Failed to add new option:', error);
		} finally {
			setIsAdding(false);
		}
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			setIsOpen(false);
			setSearchTerm('');
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (displayOptions.length === 1 && displayOptions[0]) {
				handleOptionClick(displayOptions[0]);
			} else if (showCreateButton) {
				handleCreateNew();
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			// Focus first option
			const firstOption = containerRef.current?.querySelector(
				'[data-option]'
			) as HTMLElement;
			if (firstOption) {
				firstOption.focus();
			}
		}
	};


	return (
		<div className="w-full" ref={containerRef}>
			{label && <Label htmlFor={name} value={label} className="mb-2 block" />}

			<div className="relative">
				{/* Trigger Button */}
				<button
					type="button"
					className={`
                        w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white
                        ${
													disabled
														? 'opacity-50 cursor-not-allowed'
														: 'hover:border-gray-400 cursor-pointer'
												}
                        ${
													!selectedOption
														? 'text-gray-500 dark:text-gray-400'
														: 'text-gray-900 dark:text-white'
												}
                    `}
					onClick={handleToggleDropdown}
					disabled={disabled}
					aria-expanded={isOpen}
					aria-haspopup="listbox"
				>
					<div className="flex items-center justify-between">
						<span className="truncate">{displayValue}</span>
						<motion.div
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
						>
							<HiChevronDown className="h-4 w-4" />
						</motion.div>
					</div>
				</button>

				{/* Dropdown */}
				<AnimatePresence>
					{isOpen && (
						<motion.div
							variants={dropdownVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600"
						>
							{/* Search Input */}
							<div className="p-2 border-b border-gray-200 dark:border-gray-600">
								<div className="flex items-center gap-2">
									<input
										ref={searchInputRef}
										type="text"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										onKeyDown={handleSearchKeyDown}
										placeholder="Search options..."
										className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
									/>
									<AnimatePresence>
										{showCreateButton && (
											<motion.div
												variants={createButtonVariants}
												initial="hidden"
												animate="visible"
												exit="exit"
											>
												<Button
													type="button"
													size="xs"
													color="primary"
													onClick={handleCreateNew}
													disabled={isAdding}
													className="px-2 py-0"
												>
													{isAdding ? (
														<AiOutlineLoading className="h-3 w-3 animate-spin" />
													) : (
														<>
															<HiPlus className="h-3 w-3 mr-1" />
															Create
														</>
													)}
												</Button>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>

							{/* Options List */}
							<div className="max-h-60 overflow-y-auto">
								<AnimatePresence mode="wait">
									{displayOptions.length > 0 ? (
										<motion.div
											key="options-list"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.2 }}
										>
											{displayOptions.map((option, index) => (
												<motion.button
													key={option.value}
													variants={optionVariants}
													initial="hidden"
													animate="visible"
													exit="exit"
													custom={index}
													type="button"
													className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:bg-gray-100 dark:focus:bg-gray-600 focus:outline-none text-gray-900 dark:text-white"
													onClick={() => handleOptionClick(option)}
													data-option
													tabIndex={0}
													whileHover={{
														transition: { duration: 0.15 }
													}}
													whileTap={{
														scale: 0.98,
														transition: { duration: 0.1 }
													}}
												>
													{option.label}
												</motion.button>
											))}
										</motion.div>
									) : searchTerm ? (
										<motion.div
											key="no-results"
											variants={noResultsVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm text-center"
										>
											No options found for "{searchTerm}"
											<br />
											<span className="text-xs">Use the Create button to add it</span>
										</motion.div>
									) : (
										<motion.div
											key="no-options"
											variants={noResultsVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm"
										>
											No options available
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Hidden select for form compatibility */}
			<select
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				className="sr-only"
				tabIndex={-1}
				aria-hidden="true"
			>
				<option value="">{placeholder}</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default QuickAddSelect;
