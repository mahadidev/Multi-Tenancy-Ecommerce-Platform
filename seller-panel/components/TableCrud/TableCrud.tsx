import { FormErrorType, FormStateType } from '@seller-panel/hooks/useForm';
import { MetaType } from '@seller-panel/types/tableType';
import { Breadcrumb, Button, Label, TextInput } from 'flowbite-react';
import { FC } from 'react';
import { HiDocumentDownload } from 'react-icons/hi';
import CreateModal from './CreateModal';
import DataTable from './DataTable';
import TablePagination from './TablePagination';

export interface TableCrudPropsType {
	title?: string;
	name?: string;
	item?: {
		title: string;
		key: string;
	};
	columns?: { label: string; key: string; subKey?: string; type?: string }[];
	data?: { [Key: string]: string }[] | any;
	breadcrumb?: {
		label: string;
		href?: string;
		icon?: React.ReactNode;
	}[];
	meta?: MetaType | null;
	form?: {
		label: string;
		value?: string;
		name: string;
		type: string;
		placeholder?: string;
		required?: boolean;
		options?: {
			label: string;
			value?: string | number;
			selectKey?: string | any;
			subSelectKey?: string | any;
		}[];
	}[];
	createModal?: {
		title: string;
		defaultState?: FormStateType | any;
		create: {
			submit: CallableFunction;
			isLoading: boolean;
			error: FormErrorType | any;
			isError: boolean;
			data: any;
		};
	};
	editModal?: {
		title: string;
		defaultState?: FormStateType | any;
		update: {
			submit: CallableFunction;
			isLoading: boolean;
			error: FormErrorType | any;
			isError: boolean;
			data: any;
		};
	};
	deleteModal?: {
		delete: {
			submit: CallableFunction;
			isLoading: boolean;
			error: FormErrorType | any;
			isError: boolean;
			data: any;
		};
	};
}

const TableCrud: FC<TableCrudPropsType> = function (props) {
	return (
		<>
			<div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
				<div className="mb-1 w-full">
					<div className="mb-4">
						{props.breadcrumb && (
							<Breadcrumb className="mb-5">
								{props.breadcrumb.map((breadcrumb, index: number) => (
									<>
										<Breadcrumb.Item
											key={index}
											href={breadcrumb.href ?? undefined}
										>
											<div className="flex items-center">
												{breadcrumb.icon && (
													<div className="text-xl mr-3">{breadcrumb.icon}</div>
												)}
												<span>{breadcrumb.label}</span>
											</div>
										</Breadcrumb.Item>
									</>
								))}
							</Breadcrumb>
						)}
						{props.title && (
							<h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
								{props.title}
							</h1>
						)}
					</div>
					<div className="sm:flex">
						{props.name && (
							<div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
								<form className="lg:pr-3">
									<Label htmlFor="category-search" className="sr-only">
										Search
									</Label>
									<div className="relative mt-1 lg:w-64 xl:w-96">
										<TextInput
											id={`${props.name}-search`}
											name={`${props.name}-search`}
											placeholder={`Search for ${props.name}`}
										/>
									</div>
								</form>
							</div>
						)}
						{props.createModal && (
							<div className="ml-auto flex items-center space-x-2 sm:space-x-3">
								<CreateModal {...props} />
								<Button className="p-0" color="gray">
									<div className="flex items-center gap-x-3">
										<HiDocumentDownload className="text-xl" />
										<span>Export</span>
									</div>
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
			{props.data && props.columns && (
				<div className="flex flex-col">
					<div className="overflow-x-auto">
						<div className="inline-block min-w-full align-middle">
							<div className="overflow-hidden shadow">
								<DataTable {...props} />
							</div>
						</div>
					</div>
				</div>
			)}

			{props.meta && <TablePagination {...props} />}
		</>
	);
};
export default TableCrud;
