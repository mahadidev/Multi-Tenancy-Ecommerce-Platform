import { FC, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { HiDownload, HiDocumentText, HiTable, HiDocument } from 'react-icons/hi';

interface ExportModalProps {
	isOpen: boolean;
	onClose: () => void;
	onExport: (format: 'csv' | 'xlsx' | 'pdf') => void;
	data: any[];
}

const ExportModal: FC<ExportModalProps> = ({ isOpen, onClose, onExport, data }) => {
	const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv');
	const [isExporting, setIsExporting] = useState(false);

	const exportOptions = [
		{
			format: 'csv' as const,
			title: 'CSV File',
			description: 'Comma-separated values file for spreadsheet applications',
			icon: HiTable,
			size: `~${Math.round(data.length * 0.1)}KB`
		},
		{
			format: 'xlsx' as const,
			title: 'Excel File',
			description: 'Microsoft Excel workbook with formatting',
			icon: HiDocumentText,
			size: `~${Math.round(data.length * 0.2)}KB`
		},
		{
			format: 'pdf' as const,
			title: 'PDF Report',
			description: 'Formatted PDF document with charts and tables',
			icon: HiDocument,
			size: `~${Math.round(data.length * 0.5)}KB`
		}
	];

	const handleExport = async () => {
		setIsExporting(true);
		
		// Simulate export delay
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		onExport(selectedFormat);
		setIsExporting(false);
	};

	return (
		<Modal show={isOpen} onClose={onClose} size="lg">
			<Modal.Header>
				<div className="flex items-center space-x-2">
					<HiDownload className="w-5 h-5 text-blue-600" />
					<span>Export Stock Report</span>
				</div>
			</Modal.Header>
			<Modal.Body>
				<div className="space-y-6">
					<div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							Choose Export Format
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Select the format you'd like to export your stock report data in.
						</p>
					</div>

					<div className="space-y-3">
						{exportOptions.map((option) => {
							const IconComponent = option.icon;
							return (
								<label
									key={option.format}
									className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
										selectedFormat === option.format
											? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
											: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
									}`}
								>
									<input
										type="radio"
										name="exportFormat"
										value={option.format}
										checked={selectedFormat === option.format}
										onChange={(e) => setSelectedFormat(e.target.value as 'csv' | 'xlsx' | 'pdf')}
										className="sr-only"
									/>
									<div className="flex items-center space-x-3 flex-1">
										<div className={`p-2 rounded-lg ${
											selectedFormat === option.format
												? 'bg-blue-600 text-white'
												: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
										}`}>
											<IconComponent className="w-5 h-5" />
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<h4 className="text-sm font-medium text-gray-900 dark:text-white">
													{option.title}
												</h4>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													{option.size}
												</span>
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
												{option.description}
											</p>
										</div>
									</div>
									<div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
										selectedFormat === option.format
											? 'border-blue-600'
											: 'border-gray-300 dark:border-gray-600'
									}`}>
										{selectedFormat === option.format && (
											<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
										)}
									</div>
								</label>
							);
						})}
					</div>

					<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
							Export Summary
						</h4>
						<div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
							<div className="flex justify-between">
								<span>Total Records:</span>
								<span className="font-medium">{data.length}</span>
							</div>
							<div className="flex justify-between">
								<span>Format:</span>
								<span className="font-medium uppercase">{selectedFormat}</span>
							</div>
							<div className="flex justify-between">
								<span>Estimated Size:</span>
								<span className="font-medium">
									{exportOptions.find(opt => opt.format === selectedFormat)?.size}
								</span>
							</div>
						</div>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<div className="flex items-center justify-end space-x-2 w-full">
					<Button
						color="gray"
						onClick={onClose}
						disabled={isExporting}
					>
						Cancel
					</Button>
					<Button
						onClick={handleExport}
						disabled={isExporting}
						className="bg-blue-600 hover:bg-blue-700 text-white border-0"
					>
						{isExporting ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								Exporting...
							</>
						) : (
							<>
								<HiDownload className="w-4 h-4 mr-2" />
								Export {selectedFormat.toUpperCase()}
							</>
						)}
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	);
};

export default ExportModal;