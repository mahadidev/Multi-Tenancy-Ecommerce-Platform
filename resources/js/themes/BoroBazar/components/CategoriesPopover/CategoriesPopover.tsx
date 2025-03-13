import { CategoryType } from "@type/categoryType";
import { Popover } from "flowbite-react";
import { FC } from "react";
import { HiOutlineViewGrid } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { getUrl } from "../../utils/getUrl";

export const CategoriesPopover: FC<{
    categories: CategoryType[];
    storeSlug: string;
}> = ({ categories, storeSlug }) => {
    const content = (
        <div className="w-64 text-sm text-gray-500 dark:text-gray-400 py-2 px-4">
            <div className="border-b border-gray-200 my-2 pb-2 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    Product categories
                </h3>
            </div>
            <div className="col">
                <ul className="grid my-1">
                    {categories?.map((item, index) => (
                        <li key={index} className="hover:text-gray-900">
                            <a
                                href={getUrl(
                                    storeSlug,
                                    `shop?category=${item?.slug}`
                                )}
                            >
                                {item?.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return (
        <div className="flex gap-2">
            <Popover content={content} placement="bottom">
                <button className="bg-[#5CAF90] flex gap-2 items-center font-semibold px-5 py-3 rounded-md transition-all duration-200 text-left w-full text-white text-md">
                    <HiOutlineViewGrid size={22} /> All Categories{" "}
                    <MdOutlineKeyboardArrowDown size={22} />
                </button>
            </Popover>
        </div>
    );
};
