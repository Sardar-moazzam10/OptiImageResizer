import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, Download } from "lucide-react";
import AspectRatioPresets from "./aspect-ratio-presets";
import FormatSelector from "./format-selector";
import ResizeControls from "./resize-controls";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  selectedFile: File | null;
  imageUrl: string | null;
  dimensions: { width: number; height: number };
  scale: number;
  aspectRatioLocked: boolean;
  selectedFormat: string;
  onFileSelect: (file: File) => void;
  onDimensionsChange: (dimensions: { width: number; height: number }) => void;
  onScaleChange: (scale: number) => void;
  onAspectRatioLockChange: (locked: boolean) => void;
  onFormatChange: (format: string) => void;
}

export default function ImageUploader({
  selectedFile,
  imageUrl,
  dimensions,
  scale,
  aspectRatioLocked,
  selectedFormat,
  onFileSelect,
  onDimensionsChange,
  onScaleChange,
  onAspectRatioLockChange,
  onFormatChange,
}: ImageUploaderProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aspectRatio = dimensions.width / dimensions.height;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleWidthChange = (width: number) => {
    const newDimensions = { ...dimensions, width };
    if (aspectRatioLocked) {
      newDimensions.height = Math.round(width / aspectRatio);
    }
    onDimensionsChange(newDimensions);
  };

  const handleHeightChange = (height: number) => {
    const newDimensions = { ...dimensions, height };
    if (aspectRatioLocked) {
      newDimensions.width = Math.round(height * aspectRatio);
    }
    onDimensionsChange(newDimensions);
  };

  const handleAspectRatioPresetSelect = (width: number, height: number) => {
    const newAspectRatio = width / height;
    const newWidth = dimensions.width;
    const newHeight = Math.round(newWidth / newAspectRatio);
    onDimensionsChange({ width: newWidth, height: newHeight });
  };

  const handleDownload = async () => {
    if (!selectedFile) return;
    
    setIsDownloading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const queryParams = new URLSearchParams({
        width: dimensions.width.toString(),
        height: dimensions.height.toString(),
        format: selectedFormat,
        scale: scale.toString(),
      });
      
      const response = await fetch(`/api/resize?${queryParams}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to resize image');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create an anchor and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized-image.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Image downloaded",
        description: "Your resized image has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download image",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-all mb-6 ${selectedFile ? 'border-primary' : ''}`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-lg font-medium text-gray-700 mb-1">Drop your image here</p>
              <p className="text-gray-500">or click to browse</p>
              <p className="text-gray-400 text-sm mt-2">Supports JPG, PNG, WebP, SVG</p>
            </div>
          ) : (
            <div className="flex items-center text-primary">
              <div className="flex-shrink-0 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-grow text-left">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-gray-500 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <p className="text-gray-500 text-sm">Click or drag to replace</p>
            </div>
          )}
        </div>

        <div className={`${selectedFile ? '' : 'opacity-50 pointer-events-none'}`}>
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Aspect Ratio Presets</h3>
            <AspectRatioPresets onSelect={handleAspectRatioPresetSelect} />
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <h3 className="text-base font-medium text-gray-900">Custom Dimensions</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Lock aspect ratio</span>
                <Switch
                  checked={aspectRatioLocked}
                  onCheckedChange={onAspectRatioLockChange}
                  id="lock-aspect-ratio"
                />
              </div>
            </div>

            <ResizeControls
              width={dimensions.width}
              height={dimensions.height}
              onWidthChange={handleWidthChange}
              onHeightChange={handleHeightChange}
            />
          </div>

          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Scale</h3>
            <div className="flex items-center gap-3">
              <Input
                type="range"
                min="10"
                max="200"
                value={scale}
                onChange={(e) => onScaleChange(parseInt(e.target.value, 10))}
                className="w-full"
              />
              <div className="w-16 text-center">
                <span className="text-base font-medium">{scale}</span>%
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Format</h3>
            <FormatSelector
              selectedFormat={selectedFormat}
              onChange={onFormatChange}
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="default"
              className="bg-[#10B981] hover:bg-emerald-600"
              onClick={handleDownload}
              disabled={!selectedFile || isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
