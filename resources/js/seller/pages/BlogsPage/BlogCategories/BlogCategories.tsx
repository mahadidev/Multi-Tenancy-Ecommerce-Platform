
import { RoutePath } from '@seller/seller_env';

import { Breadcrumb, Button, Label, TextInput } from 'flowbite-react';
import { FC } from 'react';
import { HiDocumentDownload, HiHome } from 'react-icons/hi';

import BlogCategoriesTable from "./BlogCategoriesTable";
import CreateBlogCategoryModal from "./CreateBlogCategoryModal";
import BlogCategoriesTablePagination from "./BlogCategoriesTablePagination";
import useBlogCategory from "@seller/hooks/useBlogCategory";
import { useFetchBlogCategoriesQuery } from '@seller/store/reducers/blogCategoryApi';

const BlogCategories: FC = function () {
    // fetch Categories
    useFetchBlogCategoriesQuery();
    const { meta } = useBlogCategory();

	return (
		<>
			<div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
				<div className="mb-1 w-full">
					<div className="mb-4">
						<Breadcrumb className="mb-5">
							<Breadcrumb.Item href={RoutePath.DashboardPage.index()}>
								<div className="flex items-center gap-x-3">
									<HiHome className="text-xl" />
									<span>Dashboard</span>
								</div>
							</Breadcrumb.Item>
							<Breadcrumb.Item href={`/seller${RoutePath.BlogsPage.index()}`}>
								<div className="flex items-center gap-x-3">
																		<span>Blogs</span>
								</div>
							</Breadcrumb.Item>
							<Breadcrumb.Item>Category</Breadcrumb.Item>
						</Breadcrumb>
						<h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
							All Blog Category
						</h1>
					</div>
					<div className="sm:flex">
						<div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
							<form className="lg:pr-3">
								<Label htmlFor="Category-search" className="sr-only">
									Search
								</Label>
								<div className="relative mt-1 lg:w-64 xl:w-96">
									<TextInput
										id="Category-search"
										name="Category-search"
										placeholder="Search for Category"
									/>
								</div>
							</form>
						</div>
						<div className="ml-auto flex items-center space-x-2 sm:space-x-3">
							<CreateBlogCategoryModal/>
							<Button className="p-0" color="gray">
								<div className="flex items-center gap-x-3">
									<HiDocumentDownload className="text-xl" />
									<span>Export</span>
								</div>
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<div className="overflow-x-auto">
					<div className="inline-block min-w-full align-middle">
						<div className="overflow-hidden shadow">
							<BlogCategoriesTable />
						</div>
					</div>
				</div>
			</div>
			{meta && <BlogCategoriesTablePagination meta={meta} />}
		</>
	);
};

export default BlogCategories;
