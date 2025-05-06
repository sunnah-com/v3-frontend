import { ImageProps } from "next/image";

/**
 * Utility functions for image optimization
 */

// Base URL for the site
export const siteUrl = 'https://sunnah.com';

/**
 * Default image dimensions for OpenGraph images
 */
export const defaultOgImageDimensions = {
  width: 1200,
  height: 630,
};

/**
 * Default image dimensions for Twitter card images
 */
export const defaultTwitterImageDimensions = {
  width: 1200,
  height: 630,
};

/**
 * Generate optimized image props for Next.js Image component
 * @param src Image source URL
 * @param alt Image alt text
 * @param width Image width
 * @param height Image height
 * @param priority Whether to prioritize loading this image
 * @returns Props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  width: number,
  height: number,
  priority: boolean = false
): ImageProps {
  return {
    src,
    alt,
    width,
    height,
    priority,
    loading: priority ? "eager" : "lazy",
  };
}

/**
 * Generate absolute URL for an image
 * @param path Relative path to the image
 * @returns Absolute URL for the image
 */
export function getAbsoluteImageUrl(path: string): string {
  // If the path already starts with http or https, it's already an absolute URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If the path starts with a slash, it's a root-relative URL
  if (path.startsWith('/')) {
    return `${siteUrl}${path}`;
  }

  // Otherwise, it's a relative URL
  return `${siteUrl}/${path}`;
}

/**
 * Generate OpenGraph image object
 * @param path Path to the image
 * @param alt Alt text for the image
 * @param width Image width (default: 1200)
 * @param height Image height (default: 630)
 * @returns OpenGraph image object
 */
export function getOgImage(
  path: string,
  alt: string,
  width: number = defaultOgImageDimensions.width,
  height: number = defaultOgImageDimensions.height
) {
  return {
    url: getAbsoluteImageUrl(path),
    width,
    height,
    alt,
  };
}

/**
 * Generate Twitter image object
 * @param path Path to the image
 * @returns Twitter image object
 */
export function getTwitterImage(path: string) {
  return getAbsoluteImageUrl(path);
}
