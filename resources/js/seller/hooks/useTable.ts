import { useState } from "react";

export interface DataTablePropsType {
    columns: {
        label?: string | React.ReactNode;
        key?: string;
        render: CallableFunction;
        sortable?: boolean;
    }[];
    data: any[];
    search?: {
        columns: string[];
    };
}

const useTable = (props: DataTablePropsType) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sort, setSort] = useState<{
        key: string;
        dir: "asc" | "desc";
    } | null>();
    const [columns] = useState(props.columns);
    const [data, setData] = useState(props.data);

    const rowsPerPage = 10;
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    // hangle paginate page change
    const onNextPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // sort data
    const sortData = ({
        sort,
        data,
    }: {
        sort: {
            key: string;
            dir: "asc" | "desc";
        };
        data: any;
    }) => {
        if (sort?.dir === "desc") {
            return data?.sort((x: any, y: any) => {
                if (x[sort?.key] < y[sort?.key]) return -1;
                if (x[sort?.key] > y[sort?.key]) return 1;
                return 0;
            });
        } else if (sort?.dir === "asc") {
            return data?.sort((x: any, y: any) => {
                if (x[sort?.key] > y[sort?.key]) return -1;
                if (x[sort?.key] < y[sort?.key]) return 1;
                return 0;
            });
        }
    };

    // handle on sort
    const onSort = (val: string) => {
        setCurrentPage(1);
        setSort((prev: any) => {
            if (prev && prev?.dir === "asc") {
                onSearch(searchQuery, true);
                return null;
            } else if (prev && prev?.dir === "desc") {
                setData((prevData) => {
                    return sortData({
                        data: prevData,
                        sort: {
                            key: val,
                            dir: "asc",
                        },
                    });
                });

                return {
                    key: val,
                    dir: "asc",
                };
            } else {
                setData((prevData) => {
                    return sortData({
                        data: prevData,
                        sort: {
                            key: val,
                            dir: "desc",
                        },
                    });
                });

                return {
                    key: val,
                    dir: "desc",
                };
            }
        });
    };

    // handle on search
    const onSearch = (query: string, onlySearch?: boolean) => {
        setCurrentPage(1);
        if (props?.search?.columns) {
            setSearchQuery(query);
            setData(() => {
                const sortedData = props?.data?.filter((dataItem: any) => {
                    const result = props?.search?.columns.map((column) => {
                        return dataItem[column]?.includes(query);
                    });

                    if (result?.includes(true)) {
                        return true;
                    }
                });

                if (sort && !onlySearch) {
                    return sortData({ data: sortedData, sort: sort });
                } else {
                    return sortedData;
                }
            });
        }
    };

    return {
        paginate: {
            totalPages,
            indexOfLastRow,
            indexOfFirstRow,
            currentPage,
            currentData: data?.slice(indexOfFirstRow, indexOfLastRow),
            onNextPage,
        },
        columns,
        data,
        setData,
        sort,
        setSort,
        onSort,
        onSearch,
    };
};
export default useTable;
