"use client";

import NextImage, { ImageProps } from "next/legacy/image"
import { useState } from "react"

// Extend ImageProps to include fill prop
interface CustomImageProps extends Omit<ImageProps, 'fill'> {
  fill?: boolean;
}

const Image = (props: CustomImageProps) => {
  // Extract fill prop separately
  const { fill, width, height, src, className, alt, ...rest } = props;
  const [hasError, setHasError] = useState(false);
  
  // Check if src is an external URL
  const isExternalUrl = typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'));
  
  // If error occurred or external URL, use regular img tag as fallback
  if (hasError || isExternalUrl) {
    if (fill === true) {
      return (
        <img
          src={src as string}
          alt={alt || ''}
          className={className}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          onError={() => setHasError(true)}
        />
      );
    }
    
    return (
      <img
        src={src as string}
        alt={alt || ''}
        className={className}
        width={width || 800}
        height={height || 600}
        style={{ width: '100%', height: 'auto' }}
        onError={() => setHasError(true)}
      />
    );
  }
  
  // For local images, use normal Next.js Image optimization
  // If fill is true, use layout='fill' for legacy Image
  if (fill === true) {
    return (
      <NextImage
        {...rest}
        src={src}
        alt={alt}
        className={className}
        layout="fill"
        onError={() => setHasError(true)}
      />
    );
  }
  
  // For regular images, ensure width and height are provided
  // If not provided, use default dimensions
  if (!width || !height) {
    return (
      <NextImage
        {...rest}
        src={src}
        alt={alt}
        className={className}
        width={800}
        height={600}
        onError={() => setHasError(true)}
      />
    );
  }
  
  return (
    <NextImage
      {...rest}
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setHasError(true)}
    />
  );
}

export default Image
