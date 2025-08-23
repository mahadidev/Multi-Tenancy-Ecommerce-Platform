import { Button, TextInput, Card } from 'flowbite-react';
import { useState } from 'react';
import { useCartOrderPlacer } from '../hooks';
import { useFetchOrderPlacerProductsQuery } from '../store/cartOrderPlacerApi';

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { addOrderProduct } = useCartOrderPlacer();
    
    const { data: productsData, isLoading } = useFetchOrderPlacerProductsQuery({
        search: searchTerm,
        page: 1
    });

    const products = productsData?.data?.products || [];

    const handleAddProduct = (product: any) => {
        addOrderProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.thumbnail || product.image || '/placeholder-image.jpg',
            stock_quantity: product.stock_quantity || 0,
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <TextInput
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                        No products found
                    </div>
                ) : (
                    products.map((product: any) => (
                        <Card key={product.id} className="cursor-pointer hover:shadow-lg">
                            <div className="flex flex-col items-center space-y-2">
                                <img
                                    src={product.thumbnail || product.image || '/placeholder-image.jpg'}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white text-center">
                                    {product.name}
                                </h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    ${product.price}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Stock: {product.stock_quantity || 0}
                                </p>
                                <Button
                                    size="sm"
                                    onClick={() => handleAddProduct(product)}
                                    disabled={!product.stock_quantity}
                                    className="w-full"
                                >
                                    Add to Order
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Products;