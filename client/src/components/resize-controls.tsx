import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResizeControlsProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

export default function ResizeControls({
  width,
  height,
  onWidthChange,
  onHeightChange,
}: ResizeControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
          Width (px)
        </Label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <Input
            type="number"
            id="width"
            value={width}
            onChange={(e) => onWidthChange(parseInt(e.target.value, 10) || 0)}
            className="pr-12"
            min={1}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">px</span>
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
          Height (px)
        </Label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <Input
            type="number"
            id="height"
            value={height}
            onChange={(e) => onHeightChange(parseInt(e.target.value, 10) || 0)}
            className="pr-12"
            min={1}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
