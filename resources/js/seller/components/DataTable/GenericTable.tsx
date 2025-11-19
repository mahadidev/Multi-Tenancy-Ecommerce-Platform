import type { ServerTableMeta, UseGenericTableReturn } from '@seller/_hooks/types/table';
import DateFilter, { PeriodType } from '@seller/modules/Order/components/DateFilter';
import { DataTablePropsType } from '@type/tableType';
import { Button, Card, Label, Table, TextInput } from 'flowbite-react';
import React, { FC, ReactNode } from 'react';
import { CSVLink } from 'react-csv';
import { HiDocumentDownload } from 'react-icons/hi';
import { MdClear } from 'react-icons/md';
import type { OrderFilters } from '../../hooks/useOrderTable';
import DataTablePagination from './DataTablePagination';

interface GenericTableProps<TData, TFilters>
	extends Omit<DataTablePropsType, 'data'> {
	// Table data from generic hook
	table: UseGenericTableReturn<TData, TFilters>;

	// Table configuration
	exportable?: boolean;
	search?: {
		placeholder: string;
		columns: string[];
		onSearchSubmit?: (args: {
			event: React.FormEvent<HTMLFormElement>;
			setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
		}) => void;
		autoFocus?: boolean;
	};
	head?: {
		render: (data: TData[]) => ReactNode;
	};
	filter?: {
		date?: {
			onChange?: (filters: {
				period?: PeriodType;
				start_date?: string;
				end_date?: string;
			}) => void;
			value?: {
				period?: PeriodType;
				start_date?: string;
				end_date?: string;
			};
		};
	};
	filename?: string;
	disablePagination?: boolean;
	disableSl?: boolean;
	disableHead?: boolean;
	bodyClassName?: string;
	tableWrapperClassName?: string;
	defaultSortBy?: string;
	defaultSortOrder?: 'asc' | 'desc';
	defaultPerPage?: number;
}

const GenericTable = <TData, TFilters>(props: GenericTableProps<TData, TFilters>): JSX.Element => {
	const {
		table,
		exportable,
		search,
		head,
		filename,
		disablePagination,
		disableSl,
		disableHead,
		bodyClassName,
		tableWrapperClassName,
		columns,
        filter
	} = props;

	// Loading state
	if (table.isLoading && !table.data.length) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Error state
	if (table.isError) {
		return (
			<div className="text-center p-8">
				<p className="text-red-500">Failed to load data</p>
			</div>
		);
	}

	return (
		<>
			{(exportable || search || head?.render || filter?.date) && (
				<div
					className={`block items-center justify-between ${
						!disableHead && ' border-b'
					} border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800`}
				>
					<div className="mb-1 w-full">
						<div className="sm:flex gap-2.5">
							{search && (
								<div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
									<form
										className="lg:pr-3"
										onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
											event.preventDefault();
											if (search.onSearchSubmit) {
												search.onSearchSubmit({
													event,
													setSearchQuery: table.setSearchQuery,
												});
											}
										}}
									>
										<Label htmlFor="search-input" className="sr-only">
											Search
										</Label>
										<div className="relative lg:w-64 xl:w-96">
											<TextInput
												id="search-input"
												name="search-input"
												placeholder={search.placeholder}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) => {
													table.setSearchQuery(event.target.value);
													table.onSearch(event.target.value);
												}}
												value={table.searchQuery}
												autoFocus={search.autoFocus ?? false}
											/>
											<MdClear
												className="absolute right-2 bottom-0 top-0 m-auto cursor-pointer"
												size={19}
												onClick={() => {
													table.setSearchQuery('');
													table.onSearch('');
												}}
											/>
										</div>
									</form>
								</div>
							)}
							{filter?.date?.onChange && filter.date.value && (
								<DateFilter
									onFilterChange={filter?.date?.onChange}
									currentFilters={filter?.date?.value}
								/>
							)}
							<div className="ml-auto flex items-center space-x-2 sm:space-x-3">
								{head && head.render(table.data)}
								{exportable && table.data && (
									<CSVLink data={table.data ?? []} filename={filename}>
										<Button
											className="p-0"
											color="gray"
											disabled={!table.data?.length}
										>
											<div className="flex items-center gap-x-3">
												<HiDocumentDownload className="text-xl" />
												<span>Export</span>
											</div>
										</Button>
									</CSVLink>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			<div className={`flex flex-col ${tableWrapperClassName ?? ''}`}>
				<div className="overflow-x-auto">
					<div className="inline-block min-w-full align-middle">
						<div className="overflow-hidden shadow">
							<Table
								className={`min-w-full ${
									!disableHead &&
									'divide-y divide-gray-200 dark:divide-gray-600'
								}`}
							>
								{!disableHead && (
									<Table.Head
										className="bg-gray-100 dark:bg-gray-700"
										theme={{
											cell: {
												base: 'p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400',
											},
										}}
									>
										{!disableSl && (
											<Table.HeadCell className="!text-center">
												SL
											</Table.HeadCell>
										)}
										{columns.map((column, index: number) => (
											<Table.HeadCell
												key={index}
												onClick={() => {
													if (column.sortable && column.key) {
														table.onSort(column.key);
													}
												}}
												className={`${column.sortable && 'cursor-pointer'}`}
											>
												<div className="flex items-center">
													{column.label}
													{column.sortable && (
														<button>
															<div>
																<span className="relative -bottom-[2px]">
																	<svg
																		className={`!w-3 !h-3 !ms-1.5 ${
																			table.currentSort?.key === column.key &&
																			table.currentSort?.dir === 'asc'
																				? '!text-black-900'
																				: '!text-gray-300'
																		}`}
																		aria-hidden="true"
																		xmlns="http://www.w3.org/2000/svg"
																		width="24"
																		height="24"
																		fill="currentColor"
																		viewBox="0 0 24 24"
																	>
																		<path
																			fillRule="evenodd"
																			d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z"
																			clipRule="evenodd"
																		/>
																	</svg>
																</span>
																<span className="relative -top-[2px]">
																	<svg
																		className={`!w-3 !h-3 !ms-1.5 ${
																			table.currentSort?.key === column.key &&
																			table.currentSort?.dir === 'desc'
																				? '!text-black-900'
																				: '!text-gray-300'
																		}`}
																		aria-hidden="true"
																		xmlns="http://www.w3.org/2000/svg"
																		width="24"
																		height="24"
																		fill="currentColor"
																		viewBox="0 0 24 24"
																	>
																		<path
																			fillRule="evenodd"
																			d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z"
																			clipRule="evenodd"
																		/>
																	</svg>
																</span>
															</div>
														</button>
													)}
												</div>
											</Table.HeadCell>
										))}
									</Table.Head>
								)}
								<Table.Body
									className={`${
										!disableHead &&
										'divide-y divide-gray-200 dark:divide-gray-700'
									} bg-white  dark:bg-gray-800 ${bodyClassName ?? ''}`}
								>
									{table.isLoading || table.isFetching ? (
										// Skeleton rows - show 1 if no data, otherwise same count as current data
										Array.from({ length: table.data?.length || 1 }).map(
											(_, skeletonIdx) => (
												<Table.Row key={`skeleton-${skeletonIdx}`}>
													{!disableSl && (
														<Table.Cell className="p-4 text-center">
															<div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
														</Table.Cell>
													)}
													{columns.map((column, colIdx) => (
														<Table.Cell key={colIdx} className="p-4">
															<div
																className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
																style={{
																	width: `${Math.random() * 40 + 60}%`, // Random width between 60-100%
																}}
															></div>
														</Table.Cell>
													))}
												</Table.Row>
											)
										)
									) : table.data?.length ? (
										<>
											{table.data.map((row: any, idx) => (
												<Table.Row
													key={row.id}
													className="hover:bg-gray-100 dark:hover:bg-gray-700"
												>
													{!disableSl && (
														<Table.Cell className="!text-center font-bold dark:text-white">
															{((table.meta?.current_page || 1) - 1) *
																(table.meta?.per_page || 10) +
																idx +
																1}
														</Table.Cell>
													)}
													{columns.map((column, idx) =>
														column.render ? (
															React.cloneElement(
																column.render(row) as React.ReactElement,
																{ key: idx }
															)
														) : (
															<Table.Cell key={idx}>
																{row[column.key ?? 0]}
															</Table.Cell>
														)
													)}
												</Table.Row>
											))}
										</>
									) : (
										<Table.Row>
											<Table.Cell
												colSpan={columns.length + (!disableSl ? 1 : 0)}
												className="p-5 text-center"
											>
												<span className="font-semibold text-gray-700 dark:text-gray-200">
													No records found
												</span>
											</Table.Cell>
										</Table.Row>
									)}
								</Table.Body>
							</Table>
						</div>
					</div>
				</div>
			</div>
			{!disablePagination && table.meta && (
				<DataTablePagination
					currentPage={table.meta.current_page}
					totalPages={table.meta.last_page}
					onPageChange={table.onPageChange}
				/>
			)}
		</>
	);
};

export default GenericTable;
