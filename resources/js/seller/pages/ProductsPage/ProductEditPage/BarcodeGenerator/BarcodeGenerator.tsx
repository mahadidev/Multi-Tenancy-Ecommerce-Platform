import { ProductType } from '@type/productType';
import { Button, Modal } from 'flowbite-react';
import JsBarcode from 'jsbarcode';
import { FC, useEffect, useRef, useState } from 'react';
import { FaBarcode } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const BarcodeGenerator: FC<{ product: ProductType }> = ({ product }) => {
	const [isOpen, setOpen] = useState(false);
	const [isSvgReady, setSvgReady] = useState(false);
	const barcodeRef = useRef<SVGSVGElement | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// 👇 Render barcode AFTER modal opens and SVG is mounted
	useEffect(() => {
		if (isOpen && product?.sku) {
			// Small delay to ensure DOM is ready
			const timer = setTimeout(() => {
				if (barcodeRef.current) {
					try {
						JsBarcode(barcodeRef.current, product.sku, {
							format: 'CODE128',
							displayValue: false,
							width: 1,
							height: 50,
							margin: 0,
						});
						setSvgReady(true);
					} catch (error) {
						console.error('Failed to generate barcode:', error);
					}
				}
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [isOpen, product, isSvgReady]);

	const handlePrint = useReactToPrint({
		contentRef,
		documentTitle: `${product?.name} Barcode`,
	});

	return (
		<>
			{product && (
				<>
					<Button color="dark" className="p-0" onClick={() => setOpen(true)}>
						<div className="flex items-center gap-x-3">
							<FaBarcode className="text-xl" />
							Generate Barcode
						</div>
					</Button>

					<Modal show={isOpen} onClose={() => setOpen(false)}>
						<Modal.Header>Generate Barcode</Modal.Header>
						<Modal.Body className="flex justify-center items-center bg-white">
							<div
								className="flex-col gap-0.5"
								ref={contentRef}
								style={{
									width: '38mm',
									height: '25mm',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									padding: 0,
									margin: 0,
								}}
							>
								<p className="w-full text-end" style={{ fontSize: '10px' }}>{product.sku}</p>
								<svg
									ref={barcodeRef}
									style={{ visibility: isSvgReady ? 'visible' : 'hidden' }}
								></svg>
								<p className='w-full font-semibold' style={{ fontSize: '10px' }}>Price - TK {product.price}</p>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button color="dark" onClick={handlePrint} disabled={!isSvgReady}>
								Print
							</Button>
						</Modal.Footer>
					</Modal>
				</>
			)}
		</>
	);
};

export default BarcodeGenerator;
