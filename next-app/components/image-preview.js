import { useEffect, useState, useRef } from 'react'
import { revokeObjectURL } from '../lib/image-processor'

export default function ImagePreview({ imageUrl, dimensions, originalSize = false }) {
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.onload = () => setLoading(false)
      img.src = imageUrl
      
      return () => {
        // Clean up by revoking object URL when component unmounts or URL changes
        revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])
  
  if (!imageUrl) {
    return (
      <div className="image-preview-container h-64 sm:h-80">
        <div className="text-center p-4">
          <p className="text-gray-500">No image selected</p>
          <p className="text-gray-400 text-sm">Upload an image to see preview</p>
        </div>
      </div>
    )
  }
  
  return (
    <div 
      className={`image-preview-container ${
        originalSize ? 'image-preview-original-size' : 'h-64 sm:h-80'
      } relative`}
      ref={containerRef}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      
      <img
        src={imageUrl}
        alt="Preview"
        style={{
          width: originalSize ? 'auto' : '100%',
          height: originalSize ? 'auto' : '100%',
          display: loading ? 'none' : 'block'
        }}
        className={originalSize ? '' : 'object-contain'}
      />
      
      {!loading && dimensions && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {dimensions.width} × {dimensions.height}
        </div>
      )}
    </div>
  )
}