

const useImage = () => {
	// load image file from url
	const getImageFileFromUrl = async ({
		onSuccess,
		url,
	}: {
		onSuccess: CallableFunction;
		url: string;
	}) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const reader = new FileReader();

			reader.onload = function (_event: ProgressEvent<FileReader>) {
				onSuccess(reader.readAsDataURL(blob));
			};
		} catch (error) {
			return 'error';
		}
	};

	// get cropped image
	const getCroppedImg = async ({
		image,
		crop,
	}: {
		image: HTMLImageElement;
		crop: PixelCrop;
	}) => {
		if (!crop.width || !crop.height) return null;

		const canvas = document.createElement('canvas');
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext('2d');

		canvas.width = crop.width;
		canvas.height = crop.height;

		if (!ctx) return null;

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);

		return new Promise((resolve) => {
			canvas.toBlob((blob) => {
				resolve(blob || null);
			}, 'image/jpeg');
		});
	};

	return { getImageFileFromUrl, getCroppedImg };
};
export default useImage;
