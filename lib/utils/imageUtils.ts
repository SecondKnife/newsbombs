/**
 * Validates and sanitizes image paths
 * Only allows images from /static/ directory or returns placeholder
 */
export function getValidImagePath(imagePath: string | null | undefined): string {
  if (!imagePath || typeof imagePath !== 'string') {
    return '/placeholder.jpg';
  }
  
  // Only allow images from /static/ directory
  if (imagePath.startsWith('/static/')) {
    return imagePath;
  }
  
  // Allow placeholder images
  if (imagePath.startsWith('/placeholder')) {
    return imagePath;
  }
  
  // Block images from /imgs/ or other invalid paths
  // Return placeholder instead
  return '/placeholder.jpg';
}

