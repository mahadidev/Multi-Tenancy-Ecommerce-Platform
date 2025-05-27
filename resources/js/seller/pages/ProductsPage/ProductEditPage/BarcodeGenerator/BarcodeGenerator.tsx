import { ProductType } from '@type/productType';
import { Button, Modal } from 'flowbite-react';
import html2canvas from 'html2canvas';
import JsBarcode from 'jsbarcode';
import { FC, useEffect, useRef, useState } from 'react';
import { FaBarcode } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const BarcodeGenerator: FC<{ product: ProductType }> = ({ product }) => {
	const [isOpen, setOpen] = useState(false);
	const [isSvgReady, setSvgReady] = useState(false);
	const barcodeRef = useRef<SVGSVGElement | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && product?.sku) {
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

	const handleDownload = async () => {
		if (!contentRef.current) return;

		try {
			const canvas = await html2canvas(contentRef.current, {
				scale: 2, // Higher quality
				backgroundColor: null, // Transparent background
				logging: false,
				useCORS: true,
			});

			const image = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.download = `${product?.name || 'barcode'}.png`;
			link.href = image;
			link.click();
		} catch (error) {
			console.error('Error downloading barcode:', error);
		}
	};

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
								className="flex-col gap-0.5 overflow-hidden"
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
								<p className="w-full text-center" style={{ fontSize: '10px' }}>
									{product.sku}
								</p>
								<svg
									ref={barcodeRef}
									style={{ visibility: isSvgReady ? 'visible' : 'hidden' }}
									className="max-w-full"
								></svg>
								<p
									className="w-full font-semibold text-center"
									style={{ fontSize: '10px' }}
								>
									Price - TK {product.price}
								</p>
							</div>
						</Modal.Body>
						<Modal.Footer className="flex gap-2">
							<Button color="dark" onClick={handlePrint} disabled={!isSvgReady}>
								Print
							</Button>
							<Button
								color="gray"
								onClick={handleDownload}
								disabled={!isSvgReady}
							>
								Download PNG
							</Button>
						</Modal.Footer>
					</Modal>
				</>
			)}
		</>
	);
};

export default BarcodeGenerator;
