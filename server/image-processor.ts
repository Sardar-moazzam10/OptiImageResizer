import sharp from "sharp";
import { createHash } from 'crypto';

// Cache processed images in memory
const imageCache = new Map<string, Buffer>();

interface ProcessImageOptions {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  scale?: number;
  quality?: number;
}

function getCacheKey(options: ProcessImageOptions): string {
  const { buffer, width, height, format, scale = 100, quality = 90 } = options;
  const hash = createHash('md5').update(buffer).digest('hex');
  return `${hash}-${width}-${height}-${format}-${scale}-${quality}`;
}

export async function processImage(options: ProcessImageOptions): Promise<Buffer> {
  try {
    const cacheKey = getCacheKey(options);
    
    // Check cache first
    const cachedImage = imageCache.get(cacheKey);
    if (cachedImage) {
      console.log('Serving image from cache');
      return cachedImage;
    }

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
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image metadata');
    }

    console.log(`Processing image: ${metadata.width}x${metadata.height} -> ${scaledWidth}x${scaledHeight}, format: ${format}`);
    
    // Create Sharp instance with optimizations
    let image = sharp(buffer, {
      failOnError: true,
      density: 72 // Optimize for web
    }).resize(scaledWidth, scaledHeight, {
      fit: 'fill',
      position: 'center',
      withoutEnlargement: true,
      fastShrinkOnLoad: true
    });

    // Set output format with optimizations
    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        image = image.jpeg({ 
          quality,
          mozjpeg: true, // Use mozjpeg for better compression
          chromaSubsampling: '4:2:0'
        });
        break;
      case 'png':
        image = image.png({ 
          quality: Math.floor(quality / 10),
          compressionLevel: 9,
          palette: true
        });
        break;
      case 'webp':
        image = image.webp({ 
          quality,
          effort: 6,
          smartSubsample: true
        });
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Process image
    const processedBuffer = await image.toBuffer();
    
    // Cache the result
    imageCache.set(cacheKey, processedBuffer);
    
    // Implement cache size limit
    if (imageCache.size > 100) {
      const firstKey = imageCache.keys().next().value;
      imageCache.delete(firstKey);
    }

    return processedBuffer;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
