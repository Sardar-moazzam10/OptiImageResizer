import { useState, useEffect, useRef } from 'react'
import { resizeImageForPreview } from '../lib/image-processor'
import ImagePreview from './image-preview'
import ResizeControls from './resize-controls'
import AspectRatioPresets from './aspect-ratio-presets'
import FormatSelector from './format-selector'

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [dimensions, setDimensions] = useState({ width: 1080, height: 1080 })
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true)
  const [selectedFormat, setSelectedFormat] = useState('jpeg')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showOriginalSize, setShowOriginalSize] = useState(false)
  const fileInputRef = useRef(null)
  
  // Generate preview when file, dimensions, or format changes
  useEffect(() => {
    let isMounted = true
    
    if (selectedFile) {
      setIsProcessing(true)
      
      // Create a preview URL
      resizeImageForPreview(selectedFile, {
        width: dimensions.width,
        height: dimensions.height,
        format: selectedFormat,
        maintainAspectRatio: aspectRatioLocked
      })
        .then(url => {
          if (isMounted) {
            // Revoke previous preview URL to avoid memory leaks
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            setPreviewUrl(url)
            setIsProcessing(false)
          }
        })
        .catch(error => {
          console.error('Error creating preview:', error)
          setIsProcessing(false)
        })
    }
    
    return () => {
      isMounted = false
    }
  }, [selectedFile, dimensions.width, dimensions.height, aspectRatioLocked, selectedFormat])
  
  // Get original dimensions when file changes
  useEffect(() => {
    if (selectedFile) {
      const img = new Image()
      const objectUrl = URL.createObjectURL(selectedFile)
      
      img.onload = () => {
        setOriginalDimensions({
          width: img.width,
          height: img.height
        })
        
        // If no custom dimensions set yet, use the original image dimensions
        if (dimensions.width === 0 || dimensions.height === 0) {
          setDimensions({
            width: img.width,
            height: img.height
          })
        }
        
        URL.revokeObjectURL(objectUrl)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
      }
      
      img.src = objectUrl
    }
  }, [selectedFile])
  
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [])
  
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }
  }
  
  const handleWidthChange = (width) => {
    setDimensions(prev => ({ ...prev, width }))
  }
  
  const handleHeightChange = (height) => {
    setDimensions(prev => ({ ...prev, height }))
  }
  
  const handleAspectRatioLockChange = (locked) => {
    setAspectRatioLocked(locked)
  }
  
  const handleFormatChange = (format) => {
    setSelectedFormat(format)
  }
  
  const handlePresetSelect = (width, height) => {
    setDimensions({ width, height })
  }
  
  const handleDownload = async () => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('width', dimensions.width)
      formData.append('height', dimensions.height)
      formData.append('format', selectedFormat)
      formData.append('maintainAspectRatio', aspectRatioLocked)
      
      const response = await fetch('/api/resize', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to resize image')
      }
      
      const blob = await response.blob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename
      const extension = selectedFormat === 'jpeg' ? 'jpg' : selectedFormat
      const filename = selectedFile.name.replace(/\.[^/.]+$/, '') || 'image'
      link.download = `${filename}_${dimensions.width}x${dimensions.height}.${extension}`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to resize image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload an image
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Choose File
              </button>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
              />
              {selectedFile && (
                <span className="text-sm text-gray-500 truncate max-w-xs">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>
          
          {selectedFile && (
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Preview</h3>
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOriginalSize}
                    onChange={(e) => setShowOriginalSize(e.target.checked)}
                  />
                  <span>Show at original size</span>
                </label>
              </div>
              <ImagePreview 
                imageUrl={previewUrl} 
                dimensions={dimensions}
                originalSize={showOriginalSize}
              />
              {originalDimensions.width > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  Original: {originalDimensions.width} × {originalDimensions.height}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-6">
          {selectedFile && (
            <>
              <ResizeControls
                width={dimensions.width}
                height={dimensions.height}
                onWidthChange={handleWidthChange}
                onHeightChange={handleHeightChange}
                aspectRatioLocked={aspectRatioLocked}
                onAspectRatioLockChange={handleAspectRatioLockChange}
              />
              
              <FormatSelector
                selectedFormat={selectedFormat}
                onChange={handleFormatChange}
              />
              
              <div className="mt-6">
                <button
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Download Resized Image'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {selectedFile && (
        <AspectRatioPresets onSelect={handlePresetSelect} />
      )}
    </div>
  )
}