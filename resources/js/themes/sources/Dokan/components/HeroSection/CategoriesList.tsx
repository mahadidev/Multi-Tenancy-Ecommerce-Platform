import { CategoryType } from "@type/categoryType";
import { FC } from "react";

const CategoriesList:FC<{
    categories: CategoryType[]
}> = ({categories}) => {
    return (
		<div className="w-full h-full bg-white">
			{categories.map((item: any) => (
				<a
					href={item.slug}
					className="block py-2 px-4 hover:bg-gray-100"
					key={item.id}
				>
					{item.name}
				</a>
			))}
		</div>
	);
}
export default CategoriesList
