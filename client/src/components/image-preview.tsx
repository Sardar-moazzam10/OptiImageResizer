import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { resizeImageForPreview } from "@/lib/image-processor";

interface ImagePreviewProps {
  imageUrl: string | null;
  dimensions: { width: number; height: number };
  scale: number;
  format: string;
  quality?: number;
  maintainAspectRatio?: boolean;
}

export default function ImagePreview({
  imageUrl,
  dimensions,
  scale,
  format,
  quality = 90,
  maintainAspectRatio = true
}: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const updatePreview = async () => {
      if (!imageUrl) {
        setPreviewUrl(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch the image file from the URL
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "preview-image", { type: blob.type });

        // Create preview with current settings
        const previewBlobUrl = await resizeImageForPreview(file, {
          width: dimensions.width,
          height: dimensions.height,
          format,
          scale,
          quality,
          maintainAspectRatio
        });

        if (isMounted) {
          setPreviewUrl(previewBlobUrl);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to generate preview");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    updatePreview();

    return () => {
      isMounted = false;
      // Cleanup preview URL when component unmounts or preview changes
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageUrl, dimensions, scale, format, quality, maintainAspectRatio]);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Preview</h3>

        <div
          className="rounded-md border border-gray-200 bg-gray-100 relative flex items-center justify-center min-h-[400px]"
          role="img"
          aria-label="Image preview"
        >
          {!imageUrl ? (
            <div className="text-center p-6">
              <div className="text-gray-400 mb-2" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Upload an image to see preview</p>
            </div>
          ) : isLoading ? (
            <div className="text-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Generating preview...</p>
            </div>
          ) : error ? (
            <div className="text-center p-6">
              <div className="text-red-400 mb-2" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : (
            <>
              <img
                src={previewUrl || imageUrl}
                alt="Preview of resized image"
                className="max-w-full max-h-[400px]"
                style={{ objectFit: 'contain' }}
                width={dimensions.width}
                height={dimensions.height}
              />
              <div
                className="absolute bottom-3 right-3 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded"
                aria-label={`Image dimensions: ${dimensions.width} by ${dimensions.height} pixels`}
              >
                {dimensions.width} × {dimensions.height} px
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>Preview shows how your image will appear after resizing</p>
          {previewUrl && (
            <p className="mt-1">
              Format: {format.toUpperCase()}, Scale: {scale}%, Quality: {quality}%
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
