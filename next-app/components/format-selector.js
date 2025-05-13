export default function FormatSelector({ selectedFormat, onChange }) {
  const formats = [
    {
      value: 'jpeg',
      label: 'JPEG',
      description: 'Best for photographs, supports millions of colors with compression'
    },
    {
      value: 'png',
      label: 'PNG',
      description: 'Supports transparency, best for graphics with text or sharp edges'
    },
    {
      value: 'webp',
      label: 'WebP',
      description: 'Modern format with better compression and quality than JPEG/PNG'
    }
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Output Format</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {formats.map((format) => (
          <button
            key={format.value}
            onClick={() => onChange(format.value)}
            className={`flex flex-col items-start p-3 border rounded-md transition-colors text-left hover:bg-gray-50 ${
              selectedFormat === format.value
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200'
            }`}
          >
            <span className="font-medium">{format.label}</span>
            <span className="text-xs text-gray-500 mt-1">{format.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}