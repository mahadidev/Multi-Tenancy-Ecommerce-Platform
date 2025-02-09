import useCart from "@seller/hooks/useCart";
import useCustomer from "@seller/hooks/useCustomer";
import useProduct from "@seller/hooks/useProduct";
import { CustomerType } from "@type/customersType";
import { ProductType } from "@type/productType";
import { Button, Card, Label, Select, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

export default function CreateOrderPage() {
    const [selectedCustomer, setSelectCustomer] = useState<string>();
    const [selectedProduct, setSelectProduct] = useState<string>();

    const { products: storeProducts } = useProduct();
    const { customers } = useCustomer();
    const { cartItems, fetchCartItems, addToCart } = useCart();

    console.log({ customers, storeProducts, cartItems });

    useEffect(() => {
        fetchCartItems.submit({
            formData: {
                id: selectedCustomer!,
            },
        });
    }, [selectedCustomer]);

    // total amount
    const totalAmount = cartItems?.reduce(
        (sum, item: any) => sum + item.qty * parseFloat(item?.price as string),
        0
    );

    return (
        <div className="p-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="grid md:grid-cols-3 gap-5 my-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="user_id">Customer</Label>
                    <Select
                        id="user_id"
                        name="user_id"
                        value={selectedCustomer}
                        onChange={(e) => setSelectCustomer(e?.target?.value)}
                        required
                    >
                        <option value={0}>Select a Customer</option>
                        {customers.map((customer: CustomerType) => (
                            <option value={customer?.id} key={customer?.id}>
                                {customer?.name}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="product_id">Product</Label>
                    <Select
                        id="product_id"
                        name="product_id"
                        value={selectedProduct}
                        onChange={(e) => setSelectProduct(e?.target?.value)}
                        required
                    >
                        <option value={0}>Select a Product</option>
                        {storeProducts.map((product: ProductType) => (
                            <option value={product?.id} key={product?.id}>
                                {product?.name}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="flex flex-col justify-end gap-2">
                    <Button
                        color="green"
                        onClick={() =>
                            addToCart.submit({
                                formData: {
                                    product_id: selectedProduct!,
                                    qty: 1,
                                    user_id: selectedCustomer!,
                                },
                            })
                        }
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
            <div className="mt-10">
                <h2 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                    Cart Summary
                </h2>
                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head className="bg-gray-100 dark:bg-gray-800">
                            <Table.HeadCell className="text-gray-900 dark:text-gray-300">
                                Item Description
                            </Table.HeadCell>
                            <Table.HeadCell className="text-gray-900 dark:text-gray-300">
                                Quantity
                            </Table.HeadCell>
                            <Table.HeadCell className="text-gray-900 dark:text-gray-300">
                                Unit Price
                            </Table.HeadCell>
                            <Table.HeadCell className="text-gray-900 dark:text-gray-300">
                                Total
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y dark:divide-gray-700">
                            {cartItems.map((item, index) => (
                                <Table.Row
                                    key={index}
                                    className="bg-gray-50 dark:bg-gray-700"
                                >
                                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                                        {item.product?.name}
                                    </Table.Cell>
                                    <Table.Cell className="flex items-center space-x-2">
                                        <Button
                                            size="xs"
                                            color="gray"
                                            disabled={item?.qty <= 0}
                                        >
                                            <HiMinus />
                                        </Button>
                                        <span className="text-gray-900 dark:text-gray-300">
                                            {item?.qty}
                                        </span>
                                        <Button
                                            size="xs"
                                            color="gray"
                                            // onClick={increaseQty}
                                        >
                                            <HiPlus />
                                        </Button>
                                    </Table.Cell>
                                    <Table.Cell className="text-gray-900 dark:text-gray-300">
                                        {item?.price?.toFixed(2)} BDT
                                    </Table.Cell>
                                    <Table.Cell className="text-gray-900 dark:text-gray-300">
                                        {(item?.qty * item?.price).toFixed(2)}{" "}
                                        BDT
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>{" "}
                    {cartItems?.length ? (
                        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 font-bold text-lg flex justify-between rounded-lg">
                            <span className="text-gray-900 dark:text-gray-300">
                                Total Amount
                            </span>
                            <span className="text-green-600 dark:text-green-400">
                                {totalAmount.toFixed(2)} BDT
                            </span>
                        </div>
                    ) : (
                        <>
                            <Card className="dark:text-gray-200 font-semibold p-5 text-center">
                                No items to show.
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
