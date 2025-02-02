import { Button, TextInput } from "flowbite-react";
import React from "react";
import { CSVLink } from "react-csv";
import DataTable from "react-data-table-component";
import { HiDocumentDownload } from "react-icons/hi";

interface DataTableProps {
    columns: any[];
    data: any[];
    handleSearch: (value: string) => void;
}

const ReactDataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    handleSearch,
}) => {
    return (
        <div className="p-4 shadow-md rounded-lg" id="react-data-table-wrapper">
            <div className="mb-4 flex justify-between items-center">
                <div className="relative mt-1 lg:w-64 xl:w-96">
                    <TextInput
                        id="Category-search"
                        name="Category-search"
                        placeholder="Search for data..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <CSVLink data={data} filename={"data.csv"}>
                    <Button className="p-0" color="gray">
                        <div className="flex items-center gap-x-3">
                            <HiDocumentDownload className="text-xl" />
                            <span>Export</span>
                        </div>
                    </Button>
                </CSVLink>
            </div>

            <DataTable
                columns={columns}
                data={data}
                pagination
                highlightOnHover
                striped
            />
        </div>
    );
};

export default ReactDataTable;
