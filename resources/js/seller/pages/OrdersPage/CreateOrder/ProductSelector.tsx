import { ProductType } from "@type/productType";
import { Label, Select } from "flowbite-react";
import { FC } from "react";

interface ProductSelectorProps {
    products: ProductType[];
    selected: number | null;
    setSelected: (val: number | null) => void;
}

export const ProductSelector: FC<ProductSelectorProps> = ({
    products,
    selected,
    setSelected,
}) => (
    <div className="flex flex-col gap-2">
        <Label htmlFor="product_id">Product</Label>
        <Select
            id="product_id"
            value={selected || ""}
            onChange={(e) => setSelected(Number(e.target.value))}
            required
        >
            <option value="">Select a Product</option>
            {products.map(({ id, name }) => (
                <option key={id} value={id}>
                    {name}
                </option>
            ))}
        </Select>
    </div>
);
