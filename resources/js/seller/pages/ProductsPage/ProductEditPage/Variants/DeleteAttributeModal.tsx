/* eslint-disable react-hooks/exhaustive-deps */
import useProductVariant from '@seller/hooks/useProductVariant';
import { ProductVariantType } from '@type/productType';
import { Button, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';

const DeleteAttributeModal = ({ variant }: { variant: ProductVariantType }) => {
	const { id } = useParams();
	const { delete: deleteVariant } = useProductVariant(id ?? 0);

	const [showModal, setShowModal] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleDelete = () => {
		deleteVariant.submit({
			formData: {
				variantId: variant.id,
				productId: id ?? 0,
			},
		});
	};

	useEffect(() => {
		if (deleteVariant.data?.status === 200) {
			setIsSuccess(true);
			setTimeout(() => {
				setShowModal(false);
				setIsSuccess(false);
			}, 500);
		}
	}, [deleteVariant.isSuccess]);

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
						<h1 className="text-xl font-medium">Delete Attribute</h1>
						<button onClick={() => setShowModal(false)}>
							<MdClose size={22} />
						</button>
					</div>

					{/* Content */}
					<div className="flex flex-col gap-2.5 py-5">
						<p className="text-sm text-gray-700 dark:text-gray-300">
							Are you sure you want to delete the attribute{' '}
							<span className="font-semibold text-red-600">
								"{variant.label}"
							</span>
							? This action is irreversible.
						</p>
					</div>

					{/* Footer */}
					<div className="pt-4 border-t flex justify-end gap-2">
						<Button
							color="light"
							onClick={() => setShowModal(false)}
							disabled={deleteVariant.isLoading}
						>
							Cancel
						</Button>
						<Button
							color="failure"
							isProcessing={deleteVariant.isLoading}
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

export default DeleteAttributeModal;
