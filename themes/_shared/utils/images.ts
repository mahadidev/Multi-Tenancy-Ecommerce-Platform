// Image utility functions

export const generateImageUrl = (
  width: number = 400, 
  height: number = 400, 
  text: string = 'Image'
): string => {
  return `https://placehold.co/${width}x${height}/f5f5f5/999?text=${encodeURIComponent(text)}`;
};

export const getImageAlt = (productName: string, imageIndex: number = 0): string => {
  return imageIndex === 0 ? productName : `${productName} - Image ${imageIndex + 1}`;
};