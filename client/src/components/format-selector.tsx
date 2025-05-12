import { Button } from "@/components/ui/button";

interface FormatSelectorProps {
  selectedFormat: string;
  onChange: (format: string) => void;
}

export default function FormatSelector({ selectedFormat, onChange }: FormatSelectorProps) {
  const formats = [
    { id: "jpg", name: "JPG" },
    { id: "png", name: "PNG" },
    { id: "webp", name: "WebP" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {formats.map((format) => (
        <Button
          key={format.id}
          variant={selectedFormat === format.id ? "default" : "outline"}
          className={selectedFormat === format.id ? "bg-primary text-white" : ""}
          onClick={() => onChange(format.id)}
        >
          {format.name}
        </Button>
      ))}
    </div>
  );
}
