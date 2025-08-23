import { Table, Button } from 'flowbite-react';
import { useCartOrderPlacer } from '../hooks';
import { OrderPlacerProduct } from '../types';

const CartProducts = () => {
    const { selectedProducts, removeOrderProduct, updateOrderProductQuantity } = useCartOrderPlacer();

    const handleQuantityChange = (productId: string, quantity: number) => {
        if (quantity > 0) {
            updateOrderProductQuantity(productId, quantity);
        }
    };

    const handleRemove = (productId: string) => {
        removeOrderProduct(productId);
    };

    return (
        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
            <Table
                hoverable
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
            >
                <Table.Head>
                    <Table.HeadCell>Product</Table.HeadCell>
                    <Table.HeadCell>Qty</Table.HeadCell>
                    <Table.HeadCell>Price</Table.HeadCell>
                    <Table.HeadCell>Total</Table.HeadCell>
                    <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {selectedProducts.map((product: OrderPlacerProduct) => (
                        <Table.Row
                            key={product.id}
                            className="bg-white dark:bg-gray-800"
                        >
                            <Table.Cell>
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-10 h-10 shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="rounded-sm w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {product.name}
                                        </p>
                                    </div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <input
                                    type="number"
                                    min="1"
                                    value={product.quantity || 1}
                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-gray-900 dark:text-white">
                                    ${product.price.toFixed(2)}
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-gray-900 dark:text-white">
                                    ${((product.price * (product.quantity || 1))).toFixed(2)}
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <Button
                                    size="sm"
                                    color="failure"
                                    onClick={() => handleRemove(product.id)}
                                >
                                    Remove
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                    {selectedProducts.length === 0 && (
                        <Table.Row>
                            <Table.Cell colSpan={5} className="text-center text-gray-500 py-4">
                                No products added to order
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </div>
    );
};

export default CartProducts;