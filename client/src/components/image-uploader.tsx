import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { measureAsync } from '@/lib/performance';
import { debounce } from '@/lib/utils';
import { Loader2, UploadCloud, Download } from "lucide-react";
import AspectRatioPresets from "./aspect-ratio-presets";
import FormatSelector from "./format-selector";
import ResizeControls from "./resize-controls";
import { apiRequest } from "@/lib/queryClient";

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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FORMATS: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
};

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
  onFormatChange
}: ImageUploaderProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const originalAspectRatio = useRef(1);

  // Debounced dimension changes to prevent too many updates
  const debouncedDimensionsChange = useCallback(
    debounce((newDimensions: { width: number; height: number }) => {
      onDimensionsChange(newDimensions);
    }, 300),
    [onDimensionsChange]
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];

      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 10MB',
          variant: 'destructive'
        });
        return;
      }

      setIsProcessing(true);

      await measureAsync(async () => {
        // Create object URL
        const objectUrl = URL.createObjectURL(file);

        // Load image and get dimensions
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objectUrl;
        });

        // Store original aspect ratio
        originalAspectRatio.current = img.width / img.height;

        // Update dimensions
        onDimensionsChange({
          width: img.width,
          height: img.height
        });

        onFileSelect(file);
      }, 'Image Loading');

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: 'Error',
        description: 'Failed to process image',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onFileSelect, onDimensionsChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS as Record<string, string[]>,
    maxFiles: 1,
    multiple: false,
    onDragEnter: (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
    },
    onDragLeave: (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
    },
    onDragOver: (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
    }
  });

  const handleWidthChange = (newWidth: number) => {
    if (aspectRatioLocked) {
      const newHeight = Math.round(newWidth / originalAspectRatio.current);
      debouncedDimensionsChange({ width: newWidth, height: newHeight });
    } else {
      debouncedDimensionsChange({ ...dimensions, width: newWidth });
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (aspectRatioLocked) {
      const newWidth = Math.round(newHeight * originalAspectRatio.current);
      debouncedDimensionsChange({ width: newWidth, height: newHeight });
    } else {
      debouncedDimensionsChange({ ...dimensions, height: newHeight });
    }
  };

  const handleAspectRatioPresetSelect = (width: number, height: number) => {
    const newAspectRatio = width / height;
    const newWidth = dimensions.width;
    const newHeight = Math.round(newWidth / newAspectRatio);
    onDimensionsChange({ width: newWidth, height: newHeight });
  };

  const handleDownload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

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
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
          ${isProcessing ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-sm text-gray-600">Processing image...</p>
            </motion.div>
          ) : imageUrl ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-600"
            >
              <p>Drop a new image to replace the current one</p>
              <p className="mt-1 text-xs">or click to browse</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-sm text-gray-600"
            >
              <UploadCloud className="w-12 h-12 mb-4 text-primary" />
              <p>Drop your image here</p>
              <p className="mt-1 text-xs">or click to browse</p>
              <p className="mt-2 text-xs text-gray-400">
                Supports JPG, PNG, and WebP up to 10MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <Input
              id="width"
              type="number"
              min="1"
              max="8000"
              value={dimensions.width}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
              disabled={!selectedFile || isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <Input
              id="height"
              type="number"
              min="1"
              max="8000"
              value={dimensions.height}
              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
              disabled={!selectedFile || isProcessing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="scale">Scale (%)</Label>
            <span className="text-sm text-gray-500">{scale}%</span>
          </div>
          <Slider
            id="scale"
            min={1}
            max={200}
            step={1}
            value={[scale]}
            onValueChange={([value]) => onScaleChange(value)}
            disabled={!selectedFile || isProcessing}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="aspect-ratio">Lock Aspect Ratio</Label>
          <Switch
            id="aspect-ratio"
            checked={aspectRatioLocked}
            onCheckedChange={onAspectRatioLockChange}
            disabled={!selectedFile || isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Output Format</Label>
          <Select
            value={selectedFormat}
            onValueChange={onFormatChange}
            disabled={!selectedFile || isProcessing}
          >
            <SelectTrigger id="format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="default"
          className="bg-[#10B981] hover:bg-emerald-600"
          onClick={handleDownload}
          disabled={!selectedFile || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download
        </Button>
      </div>
    </div>
  );
}
