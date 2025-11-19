import { Button, Modal } from 'flowbite-react';
import { useEffect } from 'react';
import { useCartOrderPlacer } from '../hooks';
import { CreateOrderPayloadType } from '../types';
import OrderReceipt from './OrderReceipt';

const Submit = () => {
    const {
        customer,
        selectedProducts,
        orderReceipt,
        createOrder,
        resetOrder,
    } = useCartOrderPlacer();

    const handleSubmitOrder = () => {
        if (!customer || selectedProducts.length === 0) {
            alert('Please add customer information and products');
            return;
        }

        // Validate that all products have stockId
        const productsWithoutStock = selectedProducts.filter(product => !product.stockId);
        if (productsWithoutStock.length > 0) {
            alert('Some products are missing stock information. Please select variants for all products.');
            return;
        }

        const orderData: CreateOrderPayloadType = {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            status: 'completed',
            payment_method: customer.address,
            is_payed: true,
            is_approved: true,
            items: selectedProducts.map(product => ({
                product_id: product.id,
                stock_id: product.stockId!, // We've validated this exists above
                qty: product.quantity || 1,
                price: product.price,
                discount_amount: product.discount_amount || 0,
                tax: product.tax || 0,
            })),
        };

        createOrder.submit({
            formData: orderData,
            onSuccess: () => {
                // Order receipt will be shown in modal
            }
        });
    };

    const handleClearOrder = () => {
        resetOrder();
    };

    const canSubmit = customer?.name && selectedProducts.length > 0;

    useEffect(() => {
			console.log(orderReceipt, 'orderReceipt');
		}, [orderReceipt]);

    return (
        <>
            {/* Order Receipt Modal */}
            <Modal
                show={!!orderReceipt}
                onClose={resetOrder}
                size="lg"
            >
                <Modal.Header>Order Placed Successfully</Modal.Header>
                <Modal.Body>
                    {orderReceipt && <OrderReceipt order={orderReceipt} />}
                </Modal.Body>
            </Modal>

            <div className="flex justify-between gap-4">
                <Button
                    type="button"
                    color="gray"
                    className="w-full"
                    onClick={handleClearOrder}
                >
                    Clear Order
                </Button>

                <Button
                    color="blue"
                    type="button"
                    className="w-full"
                    onClick={handleSubmitOrder}
                    isProcessing={createOrder.isLoading}
                    disabled={!canSubmit || createOrder.isLoading}
                    processingLabel="Creating..."
                >
                    Place Order
                </Button>
            </div>
        </>
    );
};

export default Submit;
