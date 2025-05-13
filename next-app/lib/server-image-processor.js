import sharp from 'sharp'

/**
 * Process and resize an image using Sharp
 */
export async function processImage(buffer, options) {
  try {
    // Get image metadata
    const metadata = await sharp(buffer).metadata()
    console.log(`Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`)
    
    // Create a Sharp instance with the input buffer
    let sharpInstance = sharp(buffer)
    
    // Calculate dimensions based on whether to maintain aspect ratio
    let width = options.width
    let height = options.height
    
    if (options.maintainAspectRatio) {
      const aspectRatio = metadata.width / metadata.height
      
      if (width / height > aspectRatio) {
        width = Math.round(height * aspectRatio)
      } else {
        height = Math.round(width / aspectRatio)
      }
    }
    
    // Apply resizing
    sharpInstance = sharpInstance.resize({
      width,
      height,
      fit: 'fill'
    })
    
    // Set output format
    const format = options.format || 'jpeg'
    
    switch (format) {
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({
          quality: options.quality || 90
        })
        break
      case 'png':
        sharpInstance = sharpInstance.png({
          compressionLevel: 9
        })
        break
      case 'webp':
        sharpInstance = sharpInstance.webp({
          quality: options.quality || 90
        })
        break
      default:
        sharpInstance = sharpInstance.jpeg({
          quality: options.quality || 90
        })
    }
    
    // Process the image and return the buffer
    const outputBuffer = await sharpInstance.toBuffer()
    
    return {
      buffer: outputBuffer,
      info: {
        format,
        width,
        height,
        originalWidth: metadata.width,
        originalHeight: metadata.height
      }
    }
  } catch (error) {
    console.error('Error processing image:', error)
    throw new Error('Failed to process image')
  }
}