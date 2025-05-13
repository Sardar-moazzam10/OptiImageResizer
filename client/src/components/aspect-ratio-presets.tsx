import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useCallback, useMemo } from "react";

// Types
type Platform = 'Instagram' | 'Facebook' | 'Twitter' | 'LinkedIn' | 'Pinterest' | 'YouTube' | 'TikTok' | 'Universal';
type ContentType = 'post' | 'story' | 'cover' | 'profile';

interface AspectRatioPreset {
  id: string;
  name: string;
  ratio: string;
  width: number;
  height: number;
  platform: Platform;
  type: ContentType;
  recommendedSize: string;
  description?: string;
}

interface AspectRatioPresetsProps {
  onSelect: (width: number, height: number) => void;
  className?: string;
  initialValue?: string;
}

// Constants
const DEFAULT_PLACEHOLDER = "Select aspect ratio";
const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  {
    id: "instagram-square",
    name: "Instagram Post (Square)",
    ratio: "1:1",
    width: 1,
    height: 1,
    platform: "Instagram",
    type: "post",
    recommendedSize: "1080x1080px",
    description: "Perfect for Instagram feed posts"
  },
  {
    id: "instagram-story",
    name: "Instagram Story/Reels",
    ratio: "9:16",
    width: 9,
    height: 16,
    platform: "Instagram",
    type: "story",
    recommendedSize: "1080x1920px",
    description: "Ideal for Instagram Stories and Reels"
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    ratio: "1.91:1",
    width: 1.91,
    height: 1,
    platform: "Facebook",
    type: "post",
    recommendedSize: "1200x630px",
    description: "Optimal for Facebook feed posts"
  },
  {
    id: "facebook-cover",
    name: "Facebook Cover",
    ratio: "2.7:1",
    width: 2.7,
    height: 1,
    platform: "Facebook",
    type: "cover",
    recommendedSize: "820x312px",
    description: "For Facebook page cover photos"
  },
  {
    id: "twitter-post",
    name: "Twitter Post",
    ratio: "16:9",
    width: 16,
    height: 9,
    platform: "Twitter",
    type: "post",
    recommendedSize: "1200x675px",
    description: "Best for Twitter image posts"
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post",
    ratio: "1.91:1",
    width: 1.91,
    height: 1,
    platform: "LinkedIn",
    type: "post",
    recommendedSize: "1200x627px",
    description: "Optimized for LinkedIn feed posts"
  },
  {
    id: "pinterest-pin",
    name: "Pinterest Pin",
    ratio: "2:3",
    width: 2,
    height: 3,
    platform: "Pinterest",
    type: "post",
    recommendedSize: "1000x1500px",
    description: "Ideal for Pinterest pins"
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Thumbnail",
    ratio: "16:9",
    width: 16,
    height: 9,
    platform: "YouTube",
    type: "post",
    recommendedSize: "1280x720px",
    description: "Perfect for YouTube video thumbnails"
  },
  {
    id: "tiktok-video",
    name: "TikTok Video",
    ratio: "9:16",
    width: 9,
    height: 16,
    platform: "TikTok",
    type: "post",
    recommendedSize: "1080x1920px",
    description: "Optimized for TikTok videos"
  },
  {
    id: "profile-picture",
    name: "Profile Picture",
    ratio: "1:1",
    width: 1,
    height: 1,
    platform: "Universal",
    type: "profile",
    recommendedSize: "400x400px",
    description: "Universal profile picture size"
  },
  {
    id: "landscape-photo",
    name: "Landscape Photo",
    ratio: "3:2",
    width: 3,
    height: 2,
    platform: "Universal",
    type: "post",
    recommendedSize: "1200x800px",
    description: "Standard landscape photography"
  },
  {
    id: "portrait-photo",
    name: "Portrait Photo",
    ratio: "2:3",
    width: 2,
    height: 3,
    platform: "Universal",
    type: "post",
    recommendedSize: "800x1200px",
    description: "Standard portrait photography"
  }
];

/**
 * AspectRatioPresets Component
 * 
 * A dropdown component for selecting predefined aspect ratios for image resizing.
 * Optimized for social media platforms and common photography formats.
 * 
 * @param {AspectRatioPresetsProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export default function AspectRatioPresets({
  onSelect,
  className = "",
  initialValue = ""
}: AspectRatioPresetsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>(initialValue);

  // Memoize the presets to prevent unnecessary re-renders
  const presets = useMemo(() => ASPECT_RATIO_PRESETS, []);

  // Use callback to memoize the handler
  const handlePresetChange = useCallback((value: string) => {
    setSelectedPreset(value);
    const preset = presets.find(p => p.id === value);
    if (preset) {
      onSelect(preset.width, preset.height);
    }
  }, [onSelect, presets]);

  return (
    <div className={`w-full ${className}`} role="group" aria-label="Aspect ratio selection">
      <Select
        value={selectedPreset}
        onValueChange={handlePresetChange}
        aria-label="Select aspect ratio"
      >
        <SelectTrigger className="w-full h-50">
          <SelectValue placeholder={DEFAULT_PLACEHOLDER} />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem
              key={preset.id}
              value={preset.id}
              className="flex flex-col items-start"
            >
              <div className="flex flex-col">
                <span className="font-medium" aria-label={`${preset.name} - ${preset.description}`}>
                  {preset.name}
                </span>
                <span className="text-xs text-gray-500">
                  {preset.recommendedSize} • {preset.platform}
                </span>
                {preset.description && (
                  <span className="text-xs text-gray-400 mt-1">
                    {preset.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
