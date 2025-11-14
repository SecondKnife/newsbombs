import NextImage, { ImageProps } from "next/legacy/image"

// Extend ImageProps to include fill prop
interface CustomImageProps extends Omit<ImageProps, 'fill'> {
  fill?: boolean;
}

const Image = (props: CustomImageProps) => {
  // Extract fill prop separately
  const { fill, width, height, ...rest } = props;
  
  // If fill is true, use layout='fill' for legacy Image
  if (fill === true) {
    // Remove width/height when using fill
    return <NextImage {...rest} layout="fill" />
  }
  
  // For regular images, ensure width and height are provided
  // If not provided, use default dimensions
  if (!width || !height) {
    // If no dimensions provided and no fill, use default
    return <NextImage {...rest} width={800} height={600} />
  }
  
  return <NextImage {...rest} width={width} height={height} />
}

export default Image
