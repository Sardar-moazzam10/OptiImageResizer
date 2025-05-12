import sharp from "sharp";

interface ProcessImageOptions {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  scale?: number;
  quality?: number;
}

export async function processImage(options: ProcessImageOptions): Promise<Buffer> {
  try {
    const {
      buffer,
      width,
      height,
      format,
      scale = 100,
      quality = 90
    } = options;

    // Calculate actual dimensions based on scale
    const scaledWidth = Math.round(width * scale / 100);
    const scaledHeight = Math.round(height * scale / 100);

    // Get input image metadata
    const metadata = await sharp(buffer).metadata();
    console.log(`Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);
    
    // Create Sharp instance
    let image = sharp(buffer).resize(scaledWidth, scaledHeight, {
      fit: 'fill',
      position: 'center',
    });

    // Set output format
    switch (format) {
      case 'jpg':
        image = image.jpeg({ quality });
        break;
      case 'png':
        image = image.png({ quality: Math.floor(quality / 10) });
        break;
      case 'webp':
        image = image.webp({ quality });
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Process and return buffer
    return await image.toBuffer();
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}
