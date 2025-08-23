/* eslint-disable react-hooks/exhaustive-deps */
import useProductStock from '@seller/_hooks/useProductStock';
import { ProductStockType } from '@type/productType';
import { Button, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';

const DeleteStockModal = ({ stock }: { stock: ProductStockType }) => {
	const { id } = useParams();
	const { delete: deleteStock } = useProductStock(id ?? 0, { fetchData: false }); // Don't fetch, just use mutations

	const [showModal, setShowModal] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleDelete = () => {
		deleteStock.submit({
			formData: {
				stockId: stock.id,
				productId: id ?? 0,
			},
		});
	};

	useEffect(() => {
		if (deleteStock.data?.status === 200) {
			setIsSuccess(true);
			setTimeout(() => {
				setShowModal(false);
				setIsSuccess(false);
			}, 500);
		}
	}, [deleteStock.isSuccess]);

	return (
		<>
			<button
				className="text-red-500 underline text-xs font-medium ml-3"
				onClick={() => setShowModal(true)}
			>
				Delete
			</button>

			<Modal show={showModal} onClose={() => setShowModal(false)}>
				<div className="p-4">
					{/* Header with close icon */}
					<div className="flex justify-between items-center">
						<h1 className="text-xl font-medium">Delete Stocks</h1>
						<button onClick={() => setShowModal(false)}>
							<MdClose size={22} />
						</button>
					</div>

					{/* Content */}
					<div className="flex flex-col gap-2.5 py-5">
						<p className="text-sm text-gray-700 dark:text-gray-300">
							Are you sure you want to delete the products stocks{' '}
							<span className="font-semibold text-red-600">
								"{stock.qty}"
							</span>
							? This action is irreversible.
						</p>
					</div>

					{/* Footer */}
					<div className="pt-4 border-t flex justify-end gap-2">
						<Button
							color="light"
							onClick={() => setShowModal(false)}
							disabled={deleteStock.isLoading}
						>
							Cancel
						</Button>
						<Button
							color="failure"
							isProcessing={deleteStock.isLoading}
							onClick={handleDelete}
						>
							{isSuccess ? 'Deleted!' : 'Confirm Delete'}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default DeleteStockModal;
