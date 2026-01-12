import NextImage, { ImageProps } from "next/legacy/image"

// Extend ImageProps to include fill prop
interface CustomImageProps extends Omit<ImageProps, 'fill'> {
  fill?: boolean;
}

const Image = (props: CustomImageProps) => {
  // Extract fill prop separately
  const { fill, width, height, src, ...rest } = props;
  
  // Check if src is an external URL
  const isExternalUrl = typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'));
  
  // For external URLs, use unoptimized and fallback to regular img if needed
  if (isExternalUrl) {
    // If fill is true, use layout='fill' with unoptimized
    if (fill === true) {
      return <NextImage {...rest} src={src} layout="fill" unoptimized />
    }
    
    // For regular external images, ensure width and height are provided
    if (!width || !height) {
      return <NextImage {...rest} src={src} width={800} height={600} unoptimized />
    }
    
    return <NextImage {...rest} src={src} width={width} height={height} unoptimized />
  }
  
  // For local images, use normal Next.js Image optimization
  // If fill is true, use layout='fill' for legacy Image
  if (fill === true) {
    // Remove width/height when using fill
    return <NextImage {...rest} src={src} layout="fill" />
  }
  
  // For regular images, ensure width and height are provided
  // If not provided, use default dimensions
  if (!width || !height) {
    // If no dimensions provided and no fill, use default
    return <NextImage {...rest} src={src} width={800} height={600} />
  }
  
  return <NextImage {...rest} src={src} width={width} height={height} />
}

export default Image
