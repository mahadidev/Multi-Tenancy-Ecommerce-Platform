import { ProductType } from "@type/productType";
import { ThemeWidgetPropsType } from "@type/themeType";
import { Select } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { HiOutlineViewGrid } from "react-icons/hi";
import ProductCard from "../../components/Product/ProductCard/ProductCard";
import ProductCardListView from "../../components/Product/ProductCard/ProductCardListView";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import ShopFilterSidebar from "../../components/shop-sidebar/ShopFilterSidebar";

const AllProducts: FC<ThemeWidgetPropsType> = ({ store }) => {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [sort, setSort] = useState("");
    const [products, setProducts] = useState<ProductType[]>([]);

    return (
        <section className="w-full container px-4 lg:px-0 mx-auto my-20 bg-white rounded-lg">
            <div className="grid lg:flex gap-9 w-full">
                <div className="lg:w-3/12">
                    <SectionTitle title="Filter Products" />
                    <div>
                        <ShopFilterSidebar
                            store={store}
                            onChangeProducts={setProducts}
                        />
                    </div>
                </div>

                <div className="lg:w-9/12 ">
                    <SectionTitle title="All Products" />
                    <div className="flex justify-between items-center w-full p-3 bg-white shadow-sm border rounded-lg mb-5">
                        {/* Grid/List Toggle Buttons */}
                        <div className="flex gap-2">
                            <button
                                className={`p-2 border rounded ${
                                    view === "grid"
                                        ? "bg-[#02b290] text-white"
                                        : ""
                                }`}
                                onClick={() => setView("grid")}
                            >
                                <HiOutlineViewGrid size={25} />
                            </button>
                            <button
                                className={`p-2 border rounded ${
                                    view === "list"
                                        ? "bg-[#02b290] text-white"
                                        : ""
                                }`}
                                onClick={() => setView("list")}
                            >
                                <AiOutlineUnorderedList size={25} />
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <div>
                            <Select
                                className="w-64 rounded p-2"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="" disabled>
                                    Sort by
                                </option>
                                <option value="1">Position</option>
                                <option value="2">Relevance</option>
                                <option value="3">Name, A to Z</option>
                                <option value="4">Name, Z to A</option>
                                <option value="5">Price, low to high</option>
                                <option value="6">Price, high to low</option>
                            </Select>
                        </div>
                    </div>
                    <div
                        className={`grid gap-3 ${
                            view === "grid"
                                ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
                                : "grid-cols-1 sm:grid-cols-2"
                        }`}
                    >
                        {view === "grid" ? (
                            <>
                                {products?.map((product: ProductType, idx) => (
                                    <ProductCard key={idx} product={product} />
                                ))}
                            </>
                        ) : (
                            <>
                                {products?.map((product: ProductType, idx) => (
                                    <ProductCardListView
                                        key={idx}
                                        product={product}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AllProducts;
