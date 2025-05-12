import { Card, CardContent } from "@/components/ui/card";

interface ImagePreviewProps {
  imageUrl: string | null;
  dimensions: { width: number; height: number };
}

export default function ImagePreview({ imageUrl, dimensions }: ImagePreviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Preview</h3>

        <div className="rounded-md border border-gray-200 bg-gray-100 relative flex items-center justify-center min-h-[400px]">
          {!imageUrl ? (
            <div className="text-center p-6">
              <div className="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Upload an image to see preview</p>
            </div>
          ) : (
            <>
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="max-w-full max-h-[400px]" 
                style={{ objectFit: 'contain' }}
              />
              <div className="absolute bottom-3 right-3 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {dimensions.width} × {dimensions.height} px
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>Preview shows how your image will appear after resizing</p>
        </div>
      </CardContent>
    </Card>
  );
}
