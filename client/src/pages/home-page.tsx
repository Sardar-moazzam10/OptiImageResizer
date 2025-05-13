import { useState, useEffect } from "react";
import ImageUploader from "@/components/image-uploader";
import ImagePreview from "@/components/image-preview";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(100);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>("jpg");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          <span className="text-primary">Opti</span><span className="text-black">sizer</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Transform your images with precision and style. Professional resizing tools for the modern creator.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
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
            scale={scale}
            format={selectedFormat}
            maintainAspectRatio={aspectRatioLocked}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-24"
      >
        <h2 className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Why Choose Optisizer
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-primary/20 transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">Lossless Resizing</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Experience crystal-clear image quality with our advanced resizing algorithms. No compromise on quality.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-yellow-400/20 transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-yellow-500 transition-colors duration-300">Social Media Ready</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Perfect your images for any platform with our smart presets. Instagram, Facebook, Twitter - we've got you covered.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-green-500/20 transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-500 transition-colors duration-300">Precise Control</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Take command of every pixel with our intuitive controls. Perfect dimensions, perfect results.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-6 py-3 bg-blue-500 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            Start Optimizing Your Images
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
