import { Pagination } from "flowbite-react";
import { FC } from "react";

interface PropsType {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const DataTablePagination: FC<PropsType> = (props) => {
	return (
		<>
			<div className="flex overflow-x-auto sm:justify-center">
				<Pagination
					currentPage={props.currentPage}
					totalPages={props.totalPages}
					onPageChange={props.onPageChange}
					showIcons
				/>
			</div>
		</>
	);
};
export default DataTablePagination
