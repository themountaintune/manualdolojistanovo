import { client } from '../../lib/sanity';

/**
 * Generate optimized image URL from Sanity image reference
 * @param image - Sanity image object
 * @param width - Desired width
 * @param height - Desired height
 * @param quality - Image quality (1-100)
 * @param format - Image format (webp, jpg, png)
 * @returns Optimized image URL
 */
export const getSanityImageUrl = (
  image: any,
  width?: number,
  height?: number,
  quality: number = 80,
  format: string = 'webp'
): string => {
  if (!image?.asset?._ref) {
    return '';
  }

  const baseUrl = client.config().url;
  const imageRef = image.asset._ref;
  
  // Extract image ID from reference (format: image-{id}-{extension})
  const imageId = imageRef.replace('image-', '').replace(/-[^-]+$/, '');
  
  let url = `${baseUrl}/images/${imageId}`;
  
  // Add parameters
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('fm', format);
  
  // Add fit parameter for better cropping
  if (width && height) {
    params.append('fit', 'crop');
    params.append('crop', 'center');
  }
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
};

/**
 * Get responsive image URLs for different screen sizes
 * @param image - Sanity image object
 * @param sizes - Array of size objects with width and breakpoint
 * @returns Object with srcSet and sizes attributes
 */
export const getResponsiveImageUrls = (
  image: any,
  sizes: Array<{ width: number; breakpoint: string }> = [
    { width: 400, breakpoint: '(max-width: 768px)' },
    { width: 800, breakpoint: '(max-width: 1200px)' },
    { width: 1200, breakpoint: '(min-width: 1201px)' }
  ]
) => {
  if (!image?.asset?._ref) {
    return { src: '', srcSet: '', sizes: '' };
  }

  const srcSet = sizes
    .map(({ width }) => `${getSanityImageUrl(image, width)} ${width}w`)
    .join(', ');

  const sizesAttr = sizes
    .map(({ width, breakpoint }) => `${breakpoint} ${width}px`)
    .join(', ');

  const defaultSrc = getSanityImageUrl(image, sizes[0].width);

  return {
    src: defaultSrc,
    srcSet,
    sizes: sizesAttr
  };
};

/**
 * Get image alt text from Sanity image
 * @param image - Sanity image object
 * @param fallback - Fallback alt text
 * @returns Alt text for the image
 */
export const getImageAlt = (image: any, fallback: string = ''): string => {
  return image?.alt || fallback;
};
