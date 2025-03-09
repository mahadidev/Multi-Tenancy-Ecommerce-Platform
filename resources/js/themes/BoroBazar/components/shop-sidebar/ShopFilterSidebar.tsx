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

    const weights = [
        "2kg",
        "1.5kg",
        "1kg",
        "750g",
        "500g",
        "250g",
        "100g",
        "50g",
    ];
    const colors = [
        "#E0DCDC",
        "#F7D9C4",
        "#FFD700",
        "#FF69B4",
        "#8A2BE2",
        "#00CED1",
        "#32CD32",
        "#7FFFD4",
        "#FF4500",
    ];
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

    const handleCategoriesFiltering = (categoryName: string) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(categoryName)
                ? prevCategories.filter((c) => c !== categoryName)
                : [...prevCategories, categoryName]
        );
    };

    // Update filtered products whenever selectedCategories changes
    useEffect(() => {
        const filteredProducts = selectedCategories.length
            ? store?.featuredProducts?.filter((product) =>
                  selectedCategories.includes(product?.category?.name)
              )
            : store?.featuredProducts; // Return all products if no category is selected

        onChangeProducts(filteredProducts);
    }, [selectedCategories, store?.featuredProducts]); // Also react to store updates

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
                                                    category?.name
                                                )
                                            }
                                        />
                                        {category?.name}
                                    </Label>
                                )
                            )}
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                {/* Weight Filter */}
                <AccordionPanel alwaysOpen isOpen={true}>
                    <AccordionTitle>Weight</AccordionTitle>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            {weights.map((weight, index) => (
                                <Label
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <Checkbox
                                        id={weight}
                                        name={weight}
                                        color="gray"
                                    />
                                    {weight}
                                </Label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                {/* Color Filter */}
                <AccordionPanel alwaysOpen isOpen={true}>
                    <AccordionTitle>Color</AccordionTitle>
                    <AccordionContent>
                        <div className="flex gap-2 flex-wrap">
                            {colors.map((color, index) => (
                                <button
                                    key={index}
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: color }}
                                ></button>
                            ))}
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
