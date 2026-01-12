/**
 * Validates and sanitizes image paths
 * Allows images from /static/ directory, /uploads/ (backend), and full URLs
 */
export function getValidImagePath(imagePath: string | null | undefined): string {
  if (!imagePath || typeof imagePath !== 'string') {
    return '/placeholder.jpg';
  }
  
  // Allow full URLs (from backend uploads)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Allow images from /static/ directory
  if (imagePath.startsWith('/static/')) {
    return imagePath;
  }
  
  // Allow images from /uploads/ directory (backend uploads)
  if (imagePath.startsWith('/uploads/')) {
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

