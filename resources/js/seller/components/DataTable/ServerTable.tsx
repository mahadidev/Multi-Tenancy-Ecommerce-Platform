import useTableServer, { ServerTableFilters, ServerTableMeta } from '@seller/_hooks/useTableServer';
import { DataTablePropsType } from '@type/tableType';
import { Button, Label, Table, TextInput } from 'flowbite-react';
import { FC } from 'react';
import { CSVLink } from 'react-csv';
import { HiDocumentDownload } from 'react-icons/hi';
import { MdClear } from 'react-icons/md';
import DataTablePagination from './DataTablePagination';

interface ServerTableProps extends Omit<DataTablePropsType, 'data'> {
	data: any[];
	meta: ServerTableMeta | null;
	isLoading?: boolean;
	isFetching?: boolean;
	isError?: boolean;
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
		render: CallableFunction;
	};
	filename?: string;
	disablePagination?: boolean;
	disableSl?: boolean;
	disableHead?: boolean;
	bodyClassName?: string;
	tableWrapperClassName?: string;
	onFiltersChange?: (filters: ServerTableFilters) => void;
	initialFilters?: ServerTableFilters;
	defaultSortBy?: string;
	defaultSortOrder?: 'asc' | 'desc';
	defaultPerPage?: number;
}

const ServerTable: FC<ServerTableProps> = (props) => {
	const {
		searchQuery,
		currentSort,
		onPageChange,
		onSort,
		onSearch,
		setSearchQuery,
	} = useTableServer({
		initialFilters: props.initialFilters,
		defaultSortBy: props.defaultSortBy || 'created_at',
		defaultSortOrder: props.defaultSortOrder || 'desc',
		defaultPerPage: props.defaultPerPage || 10,
		searchableColumns: props.search?.columns,
		onFiltersChange: props.onFiltersChange || undefined
	});

	// Note: onFiltersChange is already called by useTableServer, no need to duplicate

	// Loading state
	if (props.isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Error state
	if (props.isError) {
		return (
			<div className="text-center p-8">
				<p className="text-red-500">Failed to load data</p>
			</div>
		);
	}

	return (
		<>
			
			{(props.exportable || props.search || props.head?.render) && (
				<div
					className={`block items-center justify-between ${
						!props.disableHead && ' border-b'
					} border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800`}
				>
					<div className="mb-1 w-full">
						<div className="sm:flex">
							{props.search && (
								<div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
									<form
										className="lg:pr-3"
										onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
											event.preventDefault();
											if (props.search?.onSearchSubmit) {
												props.search.onSearchSubmit({
													event,
													setSearchQuery: setSearchQuery,
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
												placeholder={props.search.placeholder}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) => {
													setSearchQuery(event.target.value);
													onSearch(event.target.value);
												}}
												value={searchQuery}
												autoFocus={props.search.autoFocus ?? false}
											/>
											<MdClear 
												className='absolute right-2 bottom-0 top-0 m-auto cursor-pointer' 
												size={19} 
												onClick={() => {
													setSearchQuery("");
													onSearch("");
												}} 
											/>
										</div>
									</form>
								</div>
							)}
							<div className="ml-auto flex items-center space-x-2 sm:space-x-3">
								{props.head && props.head.render(props.data)}
								{props.exportable && props.data && (
									<CSVLink data={props.data ?? []} filename={props.filename}>
										<Button
											className="p-0"
											color="gray"
											disabled={!props.data?.length}
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
			<div className={`flex flex-col ${props.tableWrapperClassName ?? ""}`}>
				<div className="overflow-x-auto">
					<div className="inline-block min-w-full align-middle">
						<div className="overflow-hidden shadow">
							<Table
								className={`min-w-full ${
									!props.disableHead &&
									'divide-y divide-gray-200 dark:divide-gray-600'
								}`}
							>
								{!props.disableHead && (
									<Table.Head
										className="bg-gray-100 dark:bg-gray-700"
										theme={{
											cell: {
												base: 'p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400',
											},
										}}
									>
										{!props.disableSl && (
											<Table.HeadCell className="!text-center">
												SL
											</Table.HeadCell>
										)}
										{props.columns.map((column, index: number) => (
											<Table.HeadCell
												key={index}
												onClick={() => {
													if (column.sortable && column.key) {
														onSort(column.key);
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
																			currentSort?.key === column.key &&
																			currentSort?.dir === 'asc'
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
																			currentSort?.key === column.key &&
																			currentSort?.dir === 'desc'
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
										!props.disableHead &&
										'divide-y divide-gray-200 dark:divide-gray-700'
									} bg-white  dark:bg-gray-800 ${props.bodyClassName ?? ""}`}
								>
									{props.isLoading || props.isFetching ? (
										// Skeleton rows - show same count as current data or default
										Array.from({ length: props.data?.length || props.defaultPerPage || 10 }).map((_, skeletonIdx) => (
											<Table.Row key={`skeleton-${skeletonIdx}`}>
												{!props.disableSl && (
													<Table.Cell className="p-4 text-center">
														<div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
													</Table.Cell>
												)}
												{props.columns.map((_, colIdx) => (
													<Table.Cell key={colIdx} className="p-4">
														<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{
															width: `${Math.random() * 40 + 60}%` // Random width between 60-100%
														}}></div>
													</Table.Cell>
												))}
											</Table.Row>
										))
									) : props.data?.length ? (
										<>
											{props.data.map((row: any, idx) => (
												<Table.Row
													key={row.id}
													className="hover:bg-gray-100 dark:hover:bg-gray-700"
												>
													{!props.disableSl && (
														<Table.Cell className="!text-center font-bold dark:text-white">
															{((props.meta?.current_page || 1) - 1) * (props.meta?.per_page || 10) + idx + 1}
														</Table.Cell>
													)}
													{props.columns.map((column, idx) => (
														<Table.Cell key={idx}>
															{column.render
																? column.render(row)
																: row[column.key ?? 0]}
														</Table.Cell>
													))}
												</Table.Row>
											))}
										</>
									) : (
										<Table.Row>
											<Table.Cell colSpan={props.columns.length + (!props.disableSl ? 1 : 0)} className="p-5 text-center">
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
			{!props.disablePagination && props.meta && (
				<DataTablePagination
					currentPage={props.meta.current_page}
					totalPages={props.meta.last_page}
					onPageChange={onPageChange}
				/>
			)}
		</>
	);
};

export default ServerTable;