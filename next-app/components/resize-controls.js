import { useEffect, useState } from 'react'

export default function ResizeControls({
  width,
  height,
  onWidthChange,
  onHeightChange,
  aspectRatioLocked = false,
  onAspectRatioLockChange,
}) {
  const [aspectRatio, setAspectRatio] = useState(width / height)
  
  // Update aspect ratio when dimensions change externally
  useEffect(() => {
    if (width && height) {
      setAspectRatio(width / height)
    }
  }, [width, height])
  
  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10) || 0
    
    onWidthChange(newWidth)
    
    if (aspectRatioLocked && newWidth > 0) {
      const calculatedHeight = Math.round(newWidth / aspectRatio)
      onHeightChange(calculatedHeight)
    }
  }
  
  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value, 10) || 0
    
    onHeightChange(newHeight)
    
    if (aspectRatioLocked && newHeight > 0) {
      const calculatedWidth = Math.round(newHeight * aspectRatio)
      onWidthChange(calculatedWidth)
    }
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Resize Options</h3>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={aspectRatioLocked}
              onChange={(e) => onAspectRatioLockChange(e.target.checked)}
              className="mr-2"
            />
            Lock aspect ratio
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (px)
          </label>
          <input
            type="number"
            value={width}
            onChange={handleWidthChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={handleHeightChange}
            min="1" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
    </div>
  )
}