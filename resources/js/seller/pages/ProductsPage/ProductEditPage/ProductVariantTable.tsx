import useProduct from "@seller/hooks/useProduct";
import { ProductType } from "@type/productType";
import { Label, Table } from "flowbite-react";
import { FC } from "react";
import CreateVariantModal from "./CreateVariantModal";

interface ProductVariantProps {
    product: ProductType;
}
const ProductVariantTable: FC<ProductVariantProps> = ({ product }) => {
    const { removeVariant } = useProduct();

    return (
        <div className="flex flex-col gap-2 col-span-full">
            <Label>Variants</Label>
            {product?.variants?.map((variant) => (
                <div
                    className="dark:bg-[#374151] bg-[#F9FAFB] p-2.5 rounded-md  border border-solid border-slate-300"
                    key={variant.id}
                >
                    <div className="flex justify-between gap-2.5 dark:text-white">
                        {variant.label}

                        <p
                            className="cursor-pointer underline text-red-700"
                            onClick={() =>
                                removeVariant.submit({
                                    formData: variant,
                                })
                            }
                        >
                            Remove
                        </p>
                    </div>
                    <div className="mt-2.5">
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Label</Table.HeadCell>
                                <Table.HeadCell>Price</Table.HeadCell>
                                <Table.HeadCell>Stock</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {variant?.options?.map((option) => (
                                    <Table.Row
                                        className="dark:text-white text-dark"
                                        key={option.id}
                                    >
                                        <Table.Cell>{option.label}</Table.Cell>
                                        <Table.Cell>{option.price}</Table.Cell>
                                        <Table.Cell>
                                            {option.qty_stock}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            ))}
            <CreateVariantModal />
        </div>
    );
};

export default ProductVariantTable;
