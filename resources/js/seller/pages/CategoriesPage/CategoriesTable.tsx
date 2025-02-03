import ReactDataTable from "@seller/components/DataTable/DataTable";
import useCategory from "@seller/hooks/useCategory";
import { useFetchProductCategoriesQuery } from "@seller/store/reducers/categoryApi";
import { CategoryType } from "@type/categoryType";
import { useState } from "react";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoriesTable = () => {
    // fetch product categories
    useFetchProductCategoriesQuery();

    // table data
    const data: any[] = [];

    const [, setSearchText] = useState<string>();
    const [filteredData, setFilteredData] = useState<CategoryType[]>(data);

    // handle search
    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data?.filter(
            (item) =>
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.slug.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // get the product categories
    const { productCategories } = useCategory();

    productCategories?.map((category: CategoryType) =>
        data?.push({
            id: category?.id,
            name: category?.name,
            slug: category?.slug,
            has_parent: category?.has_parent,
            created_at: category?.created_at,
        })
    );

    // columns configuration
    const columns = [
        { name: "SL", selector: (row: CategoryType) => row.id, sortable: true },
        {
            name: "Name",
            key: "name",
            selector: (row: CategoryType) => row?.name,
            sortable: true,
        },
        {
            name: "Slug",
            key: "slug",
            selector: (row: CategoryType) => row?.slug,
            sortable: true,
        },
        {
            name: "Parent",
            selector: (row: CategoryType) => row?.has_parent?.name,
            sortable: true,
        },
        {
            name: "Created At",
            selector: (row: CategoryType) => row.created_at,
            sortable: true,
        },
        {
            cell: (row: CategoryType) => (
                <div className="flex items-center gap-x-3 whitespace-nowrap">
                    <EditCategoryModal category={row} />
                    <DeleteCategoryModal category={row} />
                </div>
            ),
            sortable: false,
        },
    ];

    return (
        <div className="min-w-full divide-y bg-white dark:bg-gray-800">
            <ReactDataTable
                columns={columns}
                data={filteredData!}
                handleSearch={handleSearch}
            />
            {/* <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <Table.Head
                    className="bg-gray-100 dark:bg-gray-700"
                    theme={{
                        cell: {
                            base: "p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400",
                        },
                    }}
                >
                    <Table.HeadCell className="p-4">
                        <Label htmlFor="select-all" className="sr-only">
                            Select all
                        </Label>
                        <Checkbox id="select-all" name="select-all" />
                    </Table.HeadCell>
                    <Table.HeadCell>SL</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>Slug</Table.HeadCell>
                    <Table.HeadCell>Parent</Table.HeadCell>
                    <Table.HeadCell>Created At</Table.HeadCell>
                    <Table.HeadCell />
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {productCategories?.map(
                        (category: CategoryType, idx: number) => (
                            <Table.Row
                                key={idx}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Table.Cell className="w-4 p-4">
                                    <Checkbox
                                        aria-describedby="checkbox-1"
                                        id="checkbox-1"
                                    />
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                    {idx + 1}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                    {category.name}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                    {category.slug}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                    {category.has_parent?.name}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                    {category.created_at}
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-x-3 whitespace-nowrap">
                                        <EditCategoryModal
                                            category={category}
                                        />
                                        <DeleteCategoryModal
                                            category={category}
                                        />
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        )
                    )}
                </Table.Body>
            </Table> */}
        </div>
    );
};
export default CategoriesTable;
