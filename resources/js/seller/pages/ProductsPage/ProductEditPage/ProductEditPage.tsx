/* eslint-disable react-hooks/exhaustive-deps */
import LoadingOverlay from '@seller/components/LoadingOverlay/LoadingOverlay';
import { PageBreadCrumb } from '@seller/components/PageHeader/PageBreadcrumb';
import useForm from '@seller/hooks/useForm';
import useProduct from '@seller/hooks/useProduct';
import useToast from '@seller/hooks/useToast';
import { ProductType } from '@type/productType';
import { Button, Tabs } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import BarcodeGenerator from './BarcodeGenerator/BarcodeGenerator';
import BasicInfoSection from './Sections/BasicInfoSection';
import DescriptionSection from './Sections/DescriptionSection';
import MediaSection from './Sections/MediaSection';
import PricingSection from './Sections/PricingSection';
import StockVariantsSection from './Sections/StockVariantsSection';

export interface SectionProps {
	formState: any;
	setFormState: React.Dispatch<any>;
	formErrors: any;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | any>,
		onChange?: CallableFunction
	) => void;
	product: ProductType;
	attachments: string[];
	setAttachments: React.Dispatch<React.SetStateAction<string[]>>;
}

const ProductEditPage = () => {
	const { id } = useParams();
	const { update, product, fetchProduct } = useProduct({});
	const [attachments, setAttachments] = useState<string[]>(['']);

	const { handleChange, formState, formErrors, setFormState } = useForm({
		default: {
			id: '',
			name: '',
			slug: '',
			sku: '',
			category_id: '',
			brand: '',
			price: '',
			buying_price: '',
			discount_amount: '',
			stock: '',
			tax: '',
			discount_type: 'flat',
			description: '',
			short_description: '',
			variants: [],
			has_variants: false,
			variants_type: 'none',
			attachments: [],
			variantStocks: '',
			variantValue: '',
		},
	});

	const { toaster } = useToast();

	useEffect(() => {
		if (id) {
			fetchProduct.submit({ formData: { id } });
		}
	}, [id]);

	useEffect(() => {
		if (product) {
			setAttachments(product.attachments || []);
			setFormState({
				id: product.id || '',
				name: product.name || '',
				slug: product.slug || '',
				sku: product.sku || '',
				category_id: product.category?.id || '',
				brand_id: product.brand?.id || '',
				price: product.price,
				buying_price: product.buying_price,
				tax: product.tax,
				discount_amount: product.discount_amount,
				discount_type: product.discount_type ?? 'flat',
				has_variants: product.has_variants,
				stock: product.stock,
				description: product.description,
				short_description: product.short_description,
				variants: product.variants,
				attachments: product.attachments || [],
				variantStocks: product.variantStocks,
				variantValue: product.variantValue,
			});
		}
	}, [product]);

	const commonProps: SectionProps = {
		formState,
		setFormState,
		formErrors,
		handleChange,
		product: product!,
		attachments,
		setAttachments,
	};

	return (
		<div className="dark:border-gray-700 dark:bg-gray-800 relative bg-white">
			<PageBreadCrumb
				title="Edit Product"
				items={['Product', 'Edit']}
				action={product && <BarcodeGenerator product={product} />}
			/>

			{product && (
				<section className="p-4">
					<Tabs aria-label="Product Edit Tabs">
						<Tabs.Item title="Basic Info">
							<BasicInfoSection {...commonProps} />
						</Tabs.Item>

						<Tabs.Item title="Pricing & Discount">
							<PricingSection {...commonProps} />
						</Tabs.Item>

						<Tabs.Item title="Stock & Variants">
							<StockVariantsSection {...commonProps} />
						</Tabs.Item>

						<Tabs.Item title="Descriptions">
							<DescriptionSection {...commonProps} />
						</Tabs.Item>

						<Tabs.Item title="Media">
							<MediaSection {...commonProps} />
						</Tabs.Item>
					</Tabs>

					<LoadingOverlay isLoading={fetchProduct.isLoading} position="fixed" />

					<div className="flex justify-end mt-6">
						<Button
							color="primary"
							onClick={() => {
								update.submit({
									formData: {
										...formState,
										variants: null,
										attachments,
									},
									onSuccess: () => {
										toaster({
											text: 'Product has been updated',
											status: 'success',
										});
									},
								});
							}}
							isProcessing={update.isLoading}
							disabled={update.isLoading}
							processingLabel="Saving"
							processingSpinner={<AiOutlineLoading className="animate-spin" />}
						>
							Save all
						</Button>
					</div>
				</section>
			)}
		</div>
	);
};

export default ProductEditPage;
