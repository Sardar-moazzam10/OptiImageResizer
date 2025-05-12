export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResizeOptions {
  width: number;
  height: number;
  scale?: number;
  format: string;
  quality?: number;
  maintainAspectRatio?: boolean;
}

/**
 * Creates and returns a blob URL for a resized image
 */
export async function resizeImageForPreview(
  file: File,
  options: ResizeOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    img.onload = () => {
      // Calculate dimensions
      let targetWidth = options.width;
      let targetHeight = options.height;
      
      if (options.maintainAspectRatio) {
        const aspectRatio = img.width / img.height;
        targetHeight = Math.round(targetWidth / aspectRatio);
      }
      
      // Apply scale if provided
      if (options.scale && options.scale !== 100) {
        targetWidth = Math.round(targetWidth * options.scale / 100);
        targetHeight = Math.round(targetHeight * options.scale / 100);
      }
      
      // Set canvas dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert to blob and resolve with URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        `image/${options.format}`,
        options.quality ? options.quality / 100 : 0.9
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Gets original dimensions of an image
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(file);
  });
}
