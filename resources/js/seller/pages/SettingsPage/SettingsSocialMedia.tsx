import useSocialMedia from '@seller/hooks/useSocialMedia';
import { SocialMediaListType, SocialMediaType } from '@type/socialMediaType';
import { Button, Card, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


const SettingsSocialMedia = () => {
	const { socialMedias, socialMediaList,create, delete: deleteSocialMedia } = useSocialMedia();

	const [selected, setSelected] = useState<{
		name: string;
		label: string;
		placeholder: string;
		value: string;
		item: SocialMediaListType;
	} | null>(null);
	const [disconnect, setDisconnect] = useState<SocialMediaType | null>(null);

	function onCloseModal() {
		setSelected(null);
		setDisconnect(null);
	}

	return (
		<>
			<Card>
				<div className="flow-root">
					<h3 className="text-xl font-bold dark:text-white">Social accounts</h3>
					<ul className="divide-y divide-gray-200 dark:divide-gray-700">
						{socialMediaList.map((item, index: number) => (
							<li className="py-4" key={index}>
								<div className="flex items-center space-x-4">
									<div
										className="shrink-0 w-5 h-5 text-gray-800 dark:text-white"
										dangerouslySetInnerHTML={{
											__html: item.icon,
										}}
									></div>
									<div className="min-w-0 flex-1">
										<span className="block truncate text-base font-semibold text-gray-900 dark:text-white">
											{item.label} account
										</span>

										<span
											className={`block truncate text-sm font-normal ${
												socialMedias.find(
													(socialMediaItem) =>
														socialMediaItem.name === item.name
												)
													? 'text-light-500 dark:text-light-400'
													: 'text-gray-500 dark:text-gray-400'
											}`}
										>
											{socialMedias.find(
												(socialMediaItem) => socialMediaItem.name === item.name
											)
												? `@${
														socialMedias.find(
															(socialMediaItem) =>
																socialMediaItem.name === item.name
														)?.username
												  }`
												: 'Not connected'}
										</span>
									</div>
									<div className="inline-flex items-center">
										{socialMedias.find(
											(socialMediaItem) => socialMediaItem.name === item.name
										) ? (
											<Button
												color="gray"
												size="sm"
												onClick={() => {
													const foundItem: SocialMediaType | undefined =
														socialMedias?.find(
															(socialMediaItem) =>
																socialMediaItem.name === item.name
														);
													if (foundItem) {
														setDisconnect(foundItem);
													}
												}}
											>
												Disconnect
											</Button>
										) : (
											<Button
												color="primary"
												size="sm"
												onClick={() =>
													setSelected({
														label: item.label,
														name: item.name,
														placeholder: `Enter ${item.name} page username`,
														value: '',
														item: item,
													})
												}
											>
												Connect
											</Button>
										)}
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</Card>

			<Modal
				show={selected ? true : false}
				size="md"
				onClose={onCloseModal}
				popup
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6">
						<div>
							<div className="mb-2 block">
								<Label htmlFor="socialMedia" value={selected?.label} />
							</div>
							<TextInput
								id="socialMedia"
								placeholder={selected?.placeholder}
								name={selected?.name}
								required
								color={
									create.error && 'message' in create.error ? 'failure' : 'gray'
								}
								helperText={
									create.error && 'message' in create.error
										? create.error.message
										: false
								}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setSelected((prev: any) => ({
										...prev,
										value: event.target.value,
									}));
								}}
								addon="@"
							/>
						</div>
						<div className="w-full">
							<Button
								color={selected && selected?.value ? 'blue' : 'gray'}
								disabled={selected && selected?.value ? false : true}
								isProcessing={create.isLoading}
								processingLabel="Connecting"
								processingSpinner={
									<AiOutlineLoading className="h-6 w-6 animate-spin" />
								}
								onClick={() => {
									if (selected) {
										create.submit({
											formData: {
												name: selected.name,
												label: selected.label,
												username: selected.value,
												url: selected.item.url,
											},
											onSuccess: () => onCloseModal(),
										});
									}
								}}
								value={selected?.value}
							>
								Connect
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>

			<Modal
				show={disconnect ? true : false}
				size="md"
				onClose={onCloseModal}
				popup
			>
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
						<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure to disconnect {disconnect?.label}?
						</h3>
						<div className="flex justify-center gap-4">
							<Button
								color="failure"
								onClick={() => {
									if (disconnect) {
										deleteSocialMedia.submit({
											formData: disconnect,
											onSuccess: () => {
												onCloseModal();
											},
										});
									}
								}}
							>
								{"Yes, I'm sure"}
							</Button>
							<Button color="gray" onClick={onCloseModal}>
								No, cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default SettingsSocialMedia;
