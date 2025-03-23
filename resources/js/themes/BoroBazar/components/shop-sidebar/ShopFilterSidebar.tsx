import { CategoryType } from "@type/categoryType";
import { StoreType } from "@type/storeType";
import {
    Accordion,
    AccordionContent,
    AccordionPanel,
    AccordionTitle,
    Checkbox,
    Label,
} from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface ShopFilterSidebarPropsType {
    store: StoreType;
    onChangeProducts: CallableFunction;
}
const ShopFilterSidebar: FC<ShopFilterSidebarPropsType> = ({
    store,
    onChangeProducts,
}) => {
    const [price, setPrice] = useState(250);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchParams] = useSearchParams();
    const category_QR = searchParams.get("category");

    const tags = [
        "Milk",
        "Cookies",
        "Foods",
        "Tubers",
        "Vegetables",
        "Protein",
        "Calcium",
        "Strawberry",
    ];

    const handleCategoriesFiltering = (categorySlug: string) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(categorySlug)
                ? prevCategories.filter((c) => c !== categorySlug)
                : [...prevCategories, categorySlug]
        );
    };

    useEffect(() => {
        if (category_QR) {
            setSelectedCategories([category_QR]);
        }
    }, [category_QR]);

    // Update filtered products whenever selectedCategories changes
    useEffect(() => {
        const filteredProducts = selectedCategories.length
            ? store?.storeProducts?.filter((product) =>
                  selectedCategories.includes(product?.category?.slug)
              )
            : store?.storeProducts; // Return all products if no category is selected

        onChangeProducts(filteredProducts);
    }, [selectedCategories, store?.storeProducts]); // Also react to store updates

    return (
        <div className="w-full p-4 bg-white border rounded-lg shadow-md">
            <Accordion>
                {/* Category Filter */}
                <AccordionPanel alwaysOpen isOpen={true}>
                    <AccordionTitle>Category</AccordionTitle>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            {store?.categories?.map(
                                (category: CategoryType, index) => (
                                    <Label
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={category?.name}
                                            name={category?.name}
                                            color="gray"
                                            onClick={() =>
                                                handleCategoriesFiltering(
                                                    category?.slug
                                                )
                                            }
                                            defaultChecked={Boolean(
                                                category_QR! === category?.slug
                                            )}
                                        />
                                        {category?.name}
                                    </Label>
                                )
                            )}
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                {/* Price Filter */}
                <AccordionPanel alwaysOpen isOpen={true}>
                    <AccordionTitle>Price</AccordionTitle>
                    <AccordionContent>
                        <div className="flex items-center justify-between text-sm">
                            <span>From 0</span> <span>To {price}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="250"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full mt-2"
                        />
                    </AccordionContent>
                </AccordionPanel>

                {/* Tags */}
                <AccordionPanel alwaysOpen isOpen={true}>
                    <AccordionTitle>Tags</AccordionTitle>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    );
};

export default ShopFilterSidebar;
