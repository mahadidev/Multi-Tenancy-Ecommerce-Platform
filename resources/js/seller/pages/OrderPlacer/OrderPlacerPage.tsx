import CartProducts from './CartProducts';
import CartSummary from './CartSummary';
import Customer from './Customer';
import Products from './Products';
import Submit from './Submit';

const OrderPlacerPage = () => {

	return (
		<section className="">
			<div className="grid grid-cols-2 min-h-screen">
				<div className="bg-gray-200 dark:bg-gray-800 p-6">
					<div>
						<Products />
					</div>
				</div>
				<div className="bg-gray-100 dark:bg-gray-700 p-6 flex flex-col gap-6">
					<CartProducts />
					<CartSummary />
					<Customer />
                    <Submit />
				</div>
			</div>
		</section>
	);
};
export default OrderPlacerPage;
