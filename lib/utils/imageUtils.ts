export function getValidImagePath(imagePath: string | null | undefined): string {
  if (!imagePath || typeof imagePath !== 'string') {
    return '/placeholder.jpg';
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/static/')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/placeholder')) {
    return imagePath;
  }
  
  return '/placeholder.jpg';
}

