import { useState } from "react";
import ImageUploader from "@/components/image-uploader";
import ImagePreview from "@/components/image-preview";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(100);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>("jpg");
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    
    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      setDimensions({
        width: img.width,
        height: img.height
      });
    };
    img.src = objectUrl;
  };

  const handleDimensionsChange = (newDimensions: { width: number; height: number }) => {
    setDimensions(newDimensions);
  };
  
  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };
  
  const handleAspectRatioLockChange = (locked: boolean) => {
    setAspectRatioLocked(locked);
  };
  
  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Advanced Image Resizing</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Resize your images with precision for any platform while maintaining quality
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-7/12 order-2 lg:order-1">
          <ImageUploader 
            selectedFile={selectedFile}
            imageUrl={imageUrl}
            dimensions={dimensions}
            scale={scale}
            aspectRatioLocked={aspectRatioLocked}
            selectedFormat={selectedFormat}
            onFileSelect={handleFileSelect}
            onDimensionsChange={handleDimensionsChange}
            onScaleChange={handleScaleChange}
            onAspectRatioLockChange={handleAspectRatioLockChange}
            onFormatChange={handleFormatChange}
          />
        </div>
        
        <div className="lg:w-5/12 order-1 lg:order-2">
          <ImagePreview 
            imageUrl={imageUrl}
            dimensions={dimensions}
          />
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-semibold text-center mb-12">Why Choose Optisizer</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lossless Resizing</h3>
            <p className="text-gray-600">Maintain image quality even after resizing with our advanced algorithms.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.5-8.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 8V2m-2 6h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Social Media Ready</h3>
            <p className="text-gray-600">Optimize your images for any social platform with our pre-set aspect ratios.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Precise Control</h3>
            <p className="text-gray-600">Fine-tune your images with exact dimensions, scale percentage, and format options.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
