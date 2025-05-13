/**
 * Creates and returns a blob URL for a resized image preview
 */
export async function resizeImageForPreview(file, options) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas dimensions based on options
      let width = options.width
      let height = options.height
      
      if (options.maintainAspectRatio) {
        // Calculate dimensions while maintaining aspect ratio
        const aspectRatio = img.width / img.height
        if (width / height > aspectRatio) {
          width = height * aspectRatio
        } else {
          height = width / aspectRatio
        }
      }
      
      if (options.scale) {
        width *= options.scale
        height *= options.scale
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw the image on canvas with desired dimensions
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert canvas to Blob
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob)
          resolve(url)
        },
        `image/${options.format}`,
        options.quality ? options.quality / 100 : 0.92
      )
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Gets original dimensions of an image
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      reject(new Error('Failed to load image'))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Creates an image object from a file with proper disposal of blob URLs
 */
export function createImageObject(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    
    img.onload = () => {
      resolve({
        img,
        objectUrl,
        width: img.width,
        height: img.height
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }
    
    img.src = objectUrl
  })
}

/**
 * Revokes object URLs to prevent memory leaks
 */
export function revokeObjectURL(url) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}