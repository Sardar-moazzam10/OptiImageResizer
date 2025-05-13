export default function AspectRatioPresets({ onSelect }) {
  const presets = [
    {
      name: 'Square (1:1)',
      ratio: '1:1',
      width: 1080,
      height: 1080,
      description: 'Instagram Posts, Profile Pictures'
    },
    {
      name: 'Instagram Portrait (4:5)',
      ratio: '4:5',
      width: 1080,
      height: 1350,
      description: 'Instagram Posts'
    },
    {
      name: 'Instagram Landscape (1.91:1)',
      ratio: '1.91:1',
      width: 1080,
      height: 566,
      description: 'Instagram Posts'
    },
    {
      name: 'Instagram Story (9:16)',
      ratio: '9:16',
      width: 1080,
      height: 1920,
      description: 'Instagram, Facebook Stories'
    },
    {
      name: 'Facebook Post (1.91:1)',
      ratio: '1.91:1',
      width: 1200,
      height: 628,
      description: 'Facebook Timeline, Link Posts'
    },
    {
      name: 'Twitter Post (16:9)',
      ratio: '16:9',
      width: 1200,
      height: 675,
      description: 'Twitter Timeline'
    },
    {
      name: 'LinkedIn (1.91:1)',
      ratio: '1.91:1',
      width: 1200,
      height: 627,
      description: 'LinkedIn Posts'
    },
    {
      name: 'Pinterest (2:3)',
      ratio: '2:3',
      width: 1000,
      height: 1500,
      description: 'Pinterest Posts'
    },
    {
      name: 'YouTube Thumbnail (16:9)',
      ratio: '16:9',
      width: 1280,
      height: 720,
      description: 'YouTube Video Thumbnails'
    }
  ]

  const handlePresetClick = (preset) => {
    onSelect(preset.width, preset.height)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Aspect Ratio Presets</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            className="flex flex-col items-start p-3 border rounded-md hover:bg-gray-50 transition-colors text-left"
          >
            <span className="font-medium">{preset.name}</span>
            <span className="text-xs text-gray-500 mt-1">{preset.description}</span>
            <div className="text-xs text-gray-500 mt-1">
              {preset.width} × {preset.height}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}