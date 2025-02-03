import ReactDataTable from "@seller/components/DataTable/DataTable";
import useCategory from "@seller/hooks/useCategory";
import { CategoryType } from "@type/categoryType";
import { useState } from "react";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoriesTable = () => {
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
			{ name: 'SL', selector: (row: CategoryType) => row.id, sortable: true },
			{
				name: 'Name',
				key: 'name',
				selector: (row: CategoryType) => row?.name,
				sortable: true,
			},
			{
				name: 'Slug',
				key: 'slug',
				selector: (row: CategoryType) => row?.slug,
				sortable: true,
			},
			{
				name: 'Parent',
				selector: (row: CategoryType) => row?.has_parent?.name,
				sortable: true,
			},
			{
				name: 'Created At',
				cell: (row: CategoryType) => (
					<p className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
						{row.created_at}
					</p>
				),
				sortable: true,
                maxWidth: "600px"
			},
			{
				name: 'Action',
				cell: (row: CategoryType) => (
					<div className="w-full flex items-center gap-x-3 ">
						<EditCategoryModal category={row} />
						<DeleteCategoryModal category={row} />
					</div>
				),
				sortable: false,
				width: '370px',
			},
		];

    return (
        <div className="min-w-full divide-y">
            <ReactDataTable
                columns={columns}
                data={filteredData!}
                handleSearch={handleSearch}
            />

        </div>
    );
};
export default CategoriesTable;
