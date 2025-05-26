export const isArrayEmptyOrBlank = (arr: string[]) =>
	arr.length === 0 || arr.every((item) => item.trim() === '');
