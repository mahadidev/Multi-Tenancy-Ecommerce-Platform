
import usePage from "@seller-panel/hooks/usePage";
import { Path } from "@seller-panel/pages";
import { useFetchPagesQuery } from "@seller-panel/store/reducers/pageApi";
import { Breadcrumb, Button, Label, TextInput } from 'flowbite-react';
import { FC } from 'react';
import { HiDocumentDownload, HiHome } from 'react-icons/hi';
import CreatePageModal from "./CreatePageModal";
import PagesTable from "./PagesTable";
import PagesTablePagination from "./PagesTablePagination";

const PagesPage: FC = function () {
    // fetch Pages
    useFetchPagesQuery();
    const { meta } = usePage();

	return (
		<>
			<div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
				<div className="mb-1 w-full">
					<div className="mb-4">
						<Breadcrumb className="mb-5">
							<Breadcrumb.Item href={Path.DashboardPage.index()}>
								<div className="flex items-center gap-x-3">
									<HiHome className="text-xl" />
									<span>Dashboard</span>
								</div>
							</Breadcrumb.Item>
							<Breadcrumb.Item>Page</Breadcrumb.Item>
						</Breadcrumb>
						<h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
							All Page
						</h1>
					</div>
					<div className="sm:flex">
						<div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
							<form className="lg:pr-3">
								<Label htmlFor="Page-search" className="sr-only">
									Search
								</Label>
								<div className="relative mt-1 lg:w-64 xl:w-96">
									<TextInput
										id="Page-search"
										name="Page-search"
										placeholder="Search for Page"
									/>
								</div>
							</form>
						</div>
						<div className="ml-auto flex items-center space-x-2 sm:space-x-3">
							<CreatePageModal />
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
							<PagesTable />
						</div>
					</div>
				</div>
			</div>

			{meta && <PagesTablePagination meta={meta} />}
		</>
	);
};

export default PagesPage;
