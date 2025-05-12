import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AspectRatioPreset {
  name: string;
  ratio: string;
  width: number;
  height: number;
}

interface AspectRatioPresetsProps {
  onSelect: (width: number, height: number) => void;
}

export default function AspectRatioPresets({ onSelect }: AspectRatioPresetsProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  
  const presets: AspectRatioPreset[] = [
    { name: "Square (1:1)", ratio: "1:1", width: 1, height: 1 },
    { name: "IG Portrait (4:5)", ratio: "4:5", width: 4, height: 5 },
    { name: "Stories (9:16)", ratio: "9:16", width: 9, height: 16 },
    { name: "Landscape (16:9)", ratio: "16:9", width: 16, height: 9 },
    { name: "Twitter (2:1)", ratio: "2:1", width: 2, height: 1 },
  ];

  const handlePresetClick = (preset: AspectRatioPreset) => {
    setActivePreset(preset.ratio);
    onSelect(preset.width, preset.height);
  };

  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
      {presets.map((preset) => (
        <Button
          key={preset.ratio}
          variant={activePreset === preset.ratio ? "default" : "outline"}
          className={`text-sm ${activePreset === preset.ratio ? "bg-primary text-white" : ""}`}
          onClick={() => handlePresetClick(preset)}
        >
          {preset.name}
        </Button>
      ))}
    </div>
  );
}
