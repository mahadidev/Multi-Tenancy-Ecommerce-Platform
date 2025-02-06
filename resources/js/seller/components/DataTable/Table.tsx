import useTable, { DataTablePropsType } from "@seller/hooks/useTable";
import { Button, Card, Label, Table, TextInput } from "flowbite-react";
import { FC } from "react";
import { CSVLink } from "react-csv";
import { HiDocumentDownload } from "react-icons/hi";
import DataTablePagination from "./DataTablePagination";

interface PropsType extends DataTablePropsType {
    exportable?: boolean;
    search?: {
        placeholder: string;
        columns: string[];
    };
    head?: {
        render: CallableFunction;
    };
    filename: string;
}

const DataTable: FC<PropsType> = (props) => {
    const { onSort, sort, data, columns, onSearch, paginate } = useTable(props);

    return (
        <>
            {(props.exportable || props.search || props.head?.render) && (
                <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-1 w-full">
                        <div className="sm:flex">
                            {props.search && (
                                <div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
                                    <form className="lg:pr-3">
                                        <Label
                                            htmlFor="search-input"
                                            className="sr-only"
                                        >
                                            Search
                                        </Label>
                                        <div className="relative mt-1 lg:w-64 xl:w-96">
                                            <TextInput
                                                id="search-input"
                                                name="search-input"
                                                placeholder={
                                                    props.search.placeholder
                                                }
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    onSearch(
                                                        event.target.value
                                                    );
                                                }}
                                            />
                                        </div>
                                    </form>
                                </div>
                            )}
                            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                                {props.head && props.head.render(data)}
                                {props.exportable && (
                                    <CSVLink
                                        data={props.data}
                                        filename={props.filename}
                                    >
                                        <Button className="p-0" color="gray">
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
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <Table.Head
                                    className="bg-gray-100 dark:bg-gray-700"
                                    theme={{
                                        cell: {
                                            base: "p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400",
                                        },
                                    }}
                                >
                                    <Table.HeadCell className="!text-center">
                                        SL
                                    </Table.HeadCell>
                                    {columns.map((column, index: number) => (
                                        <Table.HeadCell
                                            key={index}
                                            onClick={() => {
                                                if (
                                                    column.sortable &&
                                                    column.key
                                                ) {
                                                    onSort(column.key);
                                                }
                                            }}
                                            className={`${
                                                column.sortable &&
                                                "cursor-pointer"
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                {column.label}
                                                {column.sortable && (
                                                    <button>
                                                        <div>
                                                            <span className="relative -bottom-[2px]">
                                                                <svg
                                                                    className={`!w-3 !h-3 !ms-1.5 ${
                                                                        sort?.key ===
                                                                            column.key &&
                                                                        sort?.dir ===
                                                                            "asc"
                                                                            ? "!text-black-900"
                                                                            : "!text-gray-300"
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
                                                                        sort?.key ===
                                                                            column.key &&
                                                                        sort?.dir ===
                                                                            "desc"
                                                                            ? "!text-black-900"
                                                                            : "!text-gray-300"
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
                                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    <>
                                        {paginate.currentData.map(
                                            (row: any, idx) => (
                                                <Table.Row
                                                    key={row.id}
                                                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <td className="!text-center font-bold dark:text-white">
                                                        {idx + 1}
                                                    </td>
                                                    {columns.map(
                                                        (column, idx) => (
                                                            <td key={idx}>
                                                                {column.render
                                                                    ? column.render(
                                                                          row
                                                                      )
                                                                    : row[
                                                                          column.key ??
                                                                              0
                                                                      ]}
                                                            </td>
                                                        )
                                                    )}
                                                </Table.Row>
                                            )
                                        )}
                                    </>
                                </Table.Body>
                            </Table>{" "}
                            {paginate.currentData?.length ? null : (
                                <>
                                    <Card className="dark:text-gray-200 font-semibold p-5 text-center">
                                        No records found
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <DataTablePagination
                currentPage={paginate.currentPage}
                totalPages={paginate.totalPages}
                onPageChange={paginate.onNextPage}
            />
        </>
    );
};
export default DataTable;
