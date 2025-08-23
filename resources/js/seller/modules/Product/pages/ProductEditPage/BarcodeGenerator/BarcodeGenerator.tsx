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
							width: 2, // thicker bars
							height: 60, // taller bars
							margin: 0,
						});
						setSvgReady(true);
					} catch (error) {
						console.error('Failed to generate barcode:', error);
					}
				}
			}, 300); // increased delay

			return () => clearTimeout(timer);
		}
	}, [isOpen, product]);

	const handlePrint = useReactToPrint({
		contentRef,
		documentTitle: `${product?.name} Barcode`,
	});

	const handleDownload = async () => {
		if (!contentRef.current) return;

		try {
			const canvas = await html2canvas(contentRef.current, {
				scale: 2,
				backgroundColor: '#ffffff',
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
								ref={contentRef}
								style={{
									width: '38mm',
									height: '25mm',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: 'white',
									padding: 0,
									margin: 0,
								}}
							>
								<p
									style={{
										fontSize: '10px',
										textAlign: 'center',
										width: '100%',
									}}
								>
									{product.sku}
								</p>

								<svg
									ref={barcodeRef}
									style={{
										visibility: isSvgReady ? 'visible' : 'hidden',
										width: '38mm',
										height: 'auto',
                                        maxWidth: "100%"
									}}
									viewBox="0 0 200 60"
									preserveAspectRatio="xMidYMid meet"
                                    className='w-[38mm]'
								></svg>

								<p
									style={{
										fontSize: '10px',
										textAlign: 'center',
										width: '100%',
										fontWeight: 600,
									}}
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
