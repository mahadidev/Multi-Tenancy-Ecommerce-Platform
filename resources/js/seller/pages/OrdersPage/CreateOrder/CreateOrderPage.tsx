import useCart from "@seller/hooks/useCart";
import useCustomer from "@seller/hooks/useCustomer";
import useNotification from "@seller/hooks/useNotification";
import useOrders from "@seller/hooks/useOrders";
import useProduct from "@seller/hooks/useProduct";
import { CustomerType } from "@type/customersType";
import { ProductType } from "@type/productType";
import { Button, Card, Label, Select, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiMinus, HiOutlineTrash, HiPlus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function CreateOrderPage() {
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
    const [selectedCustomer, setSelectCustomer] = useState<number | null>(null);
    const [selectedProduct, setSelectProduct] = useState<number | null>(null);
    const { reFetchNotifications } = useNotification();
    const navigate = useNavigate(); // navigate

    const { products: storeProducts } = useProduct();
    const { customers } = useCustomer();
    const { placeOrder } = useOrders();
    const { cartItems, fetchCartItems, addToCart, updateCart, removeCartItem } =
        useCart();

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
                        value={selectedCustomer!}
                        onChange={(e) =>
                            setSelectCustomer(
                                parseInt(e?.target?.value as string)
                            )
                        }
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
                        value={selectedProduct!}
                        onChange={(e) =>
                            setSelectProduct(
                                parseInt(e?.target?.value as string)
                            )
                        }
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
                        color="primary"
                        disabled={!selectedCustomer || !selectedProduct}
                        onClick={() =>
                            addToCart.submit({
                                formData: {
                                    product_id: selectedProduct!,
                                    qty: 1,
                                    user_id: selectedCustomer!,
                                },
                            })
                        }
                        isProcessing={addToCart.isLoading}
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
                            <Table.HeadCell className="text-gray-900 dark:text-gray-300"></Table.HeadCell>
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
                                            color="primary"
                                            disabled={item?.qty <= 1}
                                            onClick={() =>
                                                updateCart.submit({
                                                    formData: {
                                                        cart_id: item?.id!,
                                                        qty: item?.qty - 1!,
                                                    },
                                                })
                                            }
                                        >
                                            <HiMinus />
                                        </Button>
                                        <span className="text-gray-900 dark:text-gray-300">
                                            {item?.qty}
                                        </span>
                                        <Button
                                            color="primary"
                                            size="xs"
                                            onClick={() =>
                                                updateCart.submit({
                                                    formData: {
                                                        cart_id: item?.id!,
                                                        qty: item?.qty + 1!,
                                                    },
                                                })
                                            }
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
                                    <Table.Cell className="text-gray-900 dark:text-gray-300">
                                        <Button
                                            color="red"
                                            size="sm"
                                            onClick={() =>
                                                removeCartItem.submit({
                                                    formData: {
                                                        cart_id: item?.id!,
                                                    },
                                                })
                                            }
                                        >
                                            <HiOutlineTrash size={18} />
                                        </Button>
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
                    <div className="flex justify-end items-center mt-4 gap-5">
                        <div className="flex flex-col gap-2">
                            <Select
                                id="payment_method"
                                name="payment_method"
                                value={paymentMethod!}
                                onChange={(e) =>
                                    setPaymentMethod(e?.target?.value as any)
                                }
                                required
                                className="w-[150px]"
                                disabled={!cartItems.length}
                            >
                                <option value={"cash"}>cash</option>
                                <option value={"card"}>card</option>
                            </Select>
                        </div>{" "}
                        <Button
                            color="primary"
                            size="md"
                            onClick={() => {
                                placeOrder.submit({
                                    formData: {
                                        ...getOrderCustomerDetails(
                                            customers,
                                            selectedCustomer!
                                        )!,
                                        payment_method: paymentMethod,
                                    },
                                    onSuccess: () => {
                                        reFetchNotifications.submit();
                                        navigate(`/orders`);
                                    },
                                });
                            }}
                            isProcessing={placeOrder.isLoading}
                            disabled={!cartItems.length}
                        >
                            Place Order
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const getOrderCustomerDetails = (
    customers: CustomerType[],
    customerId: number
) => {
    const customer = customers?.find(
        (customer: CustomerType) => customer?.id === customerId
    );

    return {
        name: customer?.name!,
        phone: customer?.phone || "017*******",
        email: customer?.email!,
        address: customer?.address || "N/A",
        user_id: customerId,
    };
};
