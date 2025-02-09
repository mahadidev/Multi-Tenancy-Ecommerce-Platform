import useCustomer from "@seller/hooks/useCustomer";
import useProduct from "@seller/hooks/useProduct";
import { Button, Table } from "flowbite-react";
import { useState } from "react";

export default function CreateOrderPage() {
    const { products: storeProducts } = useProduct();
    const { customers } = useCustomer();
    console.log({ customers, storeProducts });

    const [cart, setCart] = useState<string[]>([]);
    const [products] = useState<string[]>([
        "Apple",
        "Banana",
        "Orange",
        "Mango",
        "Pineapple",
    ]);

    const addToCart = (item: string) => {
        setCart([...cart, item]);
    };

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const { items } = {
        items: [
            {
                product: { name: "Product 1" },
                qty: 2,
                price: "10",
            },
        ],
    }; // items

    // total amount
    const totalAmount = items?.reduce(
        (sum, item: any) => sum + item.qty * parseFloat(item?.price as string),
        0
    );

    return (
        <div className="p-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex gap-2 mb-4">
                <Button color="purple">User List</Button>
                <Button color="purple">Available Fruits</Button>
                <Button color="green" onClick={() => addToCart("Sample Fruit")}>
                    Add to Cart
                </Button>
            </div>
            <div>
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
                            {items.map((item, index) => (
                                <Table.Row
                                    key={index}
                                    className="bg-gray-50 dark:bg-gray-700"
                                >
                                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                                        {item.product?.name}
                                    </Table.Cell>
                                    <Table.Cell className="text-gray-900 dark:text-gray-300">
                                        {item?.qty}
                                    </Table.Cell>
                                    <Table.Cell className="text-gray-900 dark:text-gray-300">
                                        {parseFloat(item?.price)?.toFixed(2)}{" "}
                                        BDT
                                    </Table.Cell>
                                    <Table.Cell className="text-gray-900 dark:text-gray-300">
                                        {(
                                            item?.qty * parseFloat(item?.price)
                                        ).toFixed(2)}{" "}
                                        BDT
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 font-bold text-lg flex justify-between rounded-lg">
                    <span className="text-gray-900 dark:text-gray-300">
                        Total Amount
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                        {totalAmount.toFixed(2)} BDT
                    </span>
                </div>
            </div>
        </div>
    );
}
