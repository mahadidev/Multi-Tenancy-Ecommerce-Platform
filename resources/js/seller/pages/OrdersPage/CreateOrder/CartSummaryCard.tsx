import { Button, Select, Table } from "flowbite-react";
import { FC } from "react";
import { HiMinus, HiOutlineTrash, HiPlus } from "react-icons/hi";

interface CartSummaryCardProps {
    cartItems: any[];
    totalAmount: number;
    updateCart: any;
    removeCartItem: any;
    paymentMethod: "cash" | "card";
    setPaymentMethod: (method: "cash" | "card") => void;
    handlePlaceOrder: () => void;
    isLoading: boolean;
}

export const CartSummaryCard: FC<CartSummaryCardProps> = ({
    cartItems,
    totalAmount,
    updateCart,
    removeCartItem,
    paymentMethod,
    setPaymentMethod,
    handlePlaceOrder,
    isLoading,
}) => (
    <div className="mt-10">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Cart Summary
        </h2>
        <div className="overflow-x-auto">
            <Table hoverable>
                <Table.Head className="bg-gray-100 dark:bg-gray-800">
                    {[
                        "Item Description",
                        "Quantity",
                        "Unit Price",
                        "Total",
                        "",
                    ].map((heading) => (
                        <Table.HeadCell
                            key={heading}
                            className="text-gray-900 dark:text-gray-300"
                        >
                            {heading}
                        </Table.HeadCell>
                    ))}
                </Table.Head>
                <Table.Body className="divide-y dark:divide-gray-700">
                    {cartItems.map(({ id, product, qty, price }) => (
                        <Table.Row
                            key={id}
                            className="bg-gray-50 dark:bg-gray-700"
                        >
                            <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                                {product?.name}
                            </Table.Cell>
                            <Table.Cell className="flex items-center space-x-2">
                                <Button
                                    size="xs"
                                    color="primary"
                                    disabled={qty <= 1}
                                    onClick={() =>
                                        updateCart.submit({
                                            formData: {
                                                cart_id: id,
                                                qty: qty - 1,
                                            },
                                        })
                                    }
                                >
                                    <HiMinus />
                                </Button>
                                <span className="text-gray-900 dark:text-gray-300">
                                    {qty}
                                </span>
                                <Button
                                    size="xs"
                                    color="primary"
                                    onClick={() =>
                                        updateCart.submit({
                                            formData: {
                                                cart_id: id,
                                                qty: qty + 1,
                                            },
                                        })
                                    }
                                >
                                    <HiPlus />
                                </Button>
                            </Table.Cell>
                            <Table.Cell className="text-gray-900 dark:text-gray-300">
                                {price.toFixed(2)} BDT
                            </Table.Cell>
                            <Table.Cell className="text-gray-900 dark:text-gray-300">
                                {(qty * price).toFixed(2)} BDT
                            </Table.Cell>
                            <Table.Cell>
                                <Button
                                    color="red"
                                    size="sm"
                                    onClick={() =>
                                        removeCartItem.submit({
                                            formData: { cart_id: id },
                                        })
                                    }
                                >
                                    <HiOutlineTrash size={18} />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            {cartItems.length > 0 && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 font-bold text-lg flex justify-between rounded-lg">
                    <span className="text-black dark:text-white">
                        Total Amount
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                        {totalAmount.toFixed(2)} BDT
                    </span>
                </div>
            )}

            <div className="flex justify-end items-center mt-4 gap-5">
                <Select
                    value={paymentMethod}
                    onChange={(e) =>
                        setPaymentMethod(e.target.value as "cash" | "card")
                    }
                    disabled={!cartItems.length}
                >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                </Select>
                <Button
                    color="primary"
                    onClick={handlePlaceOrder}
                    isProcessing={isLoading}
                    disabled={!cartItems.length}
                >
                    Place Order
                </Button>
            </div>
        </div>
    </div>
);
