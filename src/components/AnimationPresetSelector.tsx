import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  ANIMATION_PRESETS, 
  getAvailablePresets,
  ChartAnimationConfig,
  createAnimationStyle
} from '@/utils/chartAnimations';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Waves, 
  Sparkle, 
  Minus, 
  Database,
  Settings 
} from '@phosphor-icons/react';

interface AnimationPresetSelectorProps {
  value: ChartAnimationConfig['animation'];
  onChange: (animation: ChartAnimationConfig['animation']) => void;
  onPreview?: (preset: string) => void;
}

const PRESET_ICONS = {
  professional: Database,
  dynamic: Zap,
  smooth: Waves,
  playful: Sparkle,
  minimal: Minus,
  technical: Settings,
};

export function AnimationPresetSelector({ 
  value = { enabled: false }, 
  onChange,
  onPreview 
}: AnimationPresetSelectorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const presets = getAvailablePresets();

  const handlePresetChange = (presetKey: string) => {
    const preset = ANIMATION_PRESETS[presetKey as keyof typeof ANIMATION_PRESETS];
    if (preset) {
      onChange({
        ...value,
        preset: presetKey as keyof typeof ANIMATION_PRESETS,
        customDuration: preset.duration,
        customEasing: preset.easing,
      });
    }
  };

  const handleEnabledChange = (enabled: boolean) => {
    onChange({
      ...value,
      enabled,
    });
  };

  const handleDurationChange = (duration: number[]) => {
    onChange({
      ...value,
      customDuration: `${duration[0]}s`,
    });
  };

  const handleStaggerChange = (stagger: boolean) => {
    onChange({
      ...value,
      staggerElements: stagger,
    });
  };

  const handleChartTypeChange = (chartType: string) => {
    onChange({
      ...value,
      chartType: chartType as any,
    });
  };

  const handlePreview = (presetKey: string) => {
    if (onPreview) {
      onPreview(presetKey);
    }
  };

  const getDurationValue = (): number => {
    if (value.customDuration) {
      return parseFloat(value.customDuration.replace('s', ''));
    }
    if (value.preset && ANIMATION_PRESETS[value.preset]) {
      return parseFloat(ANIMATION_PRESETS[value.preset].duration.replace('s', ''));
    }
    return 0.8;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Grafiek Animaties</h3>
          <div className="flex items-center space-x-2">
            <Label htmlFor="animation-enabled">Ingeschakeld</Label>
            <Switch
              id="animation-enabled"
              checked={value.enabled}
              onCheckedChange={handleEnabledChange}
            />
          </div>
        </div>

        {value.enabled && (
          <>
            {/* Preset Selection */}
            <div className="space-y-3">
              <Label>Animatie Preset</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {presets.map((preset) => {
                  const Icon = PRESET_ICONS[preset.key as keyof typeof PRESET_ICONS];
                  const isSelected = value.preset === preset.key;
                  
                  return (
                    <Card
                      key={preset.key}
                      className={`p-4 cursor-pointer transition-all hover:border-primary ${
                        isSelected ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handlePresetChange(preset.key)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon size={20} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                        <span className="font-medium">{preset.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(preset.key);
                          }}
                          className="ml-auto"
                        >
                          <Play size={14} />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Chart Type Selection */}
            <div className="space-y-3">
              <Label>Grafiek Type</Label>
              <Select value={value.chartType || 'line'} onValueChange={handleChartTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer grafiek type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Lijn Grafiek</SelectItem>
                  <SelectItem value="bar">Staaf Grafiek</SelectItem>
                  <SelectItem value="pie">Taart Grafiek</SelectItem>
                  <SelectItem value="area">Vlak Grafiek</SelectItem>
                  <SelectItem value="scatter">Spreidings Grafiek</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Animatie Snelheid</Label>
                <Badge variant="secondary">{getDurationValue().toFixed(1)}s</Badge>
              </div>
              <Slider
                value={[getDurationValue()]}
                onValueChange={handleDurationChange}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Snel (0.1s)</span>
                <span>Langzaam (3.0s)</span>
              </div>
            </div>

            {/* Stagger Elements */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Gespreide Animatie</Label>
                <p className="text-sm text-muted-foreground">
                  Animeer elementen één voor één
                </p>
              </div>
              <Switch
                checked={value.staggerElements || false}
                onCheckedChange={handleStaggerChange}
              />
            </div>

            {/* Accessibility Option */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Verminder Beweging</Label>
                <p className="text-sm text-muted-foreground">
                  Respect gebruikers voorkeur voor minder beweging
                </p>
              </div>
              <Switch
                checked={value.reduceMotion || true}
                onCheckedChange={(checked) => onChange({
                  ...value,
                  reduceMotion: checked,
                })}
              />
            </div>

            {/* Preview Section */}
            {value.preset && (
              <div className="space-y-3">
                <Label>Preset Details</Label>
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Timing:</span>
                      <span>{ANIMATION_PRESETS[value.preset].easing}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Vertraging:</span>
                      <span>{ANIMATION_PRESETS[value.preset].staggerDelay}s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Standaard Duur:</span>
                      <span>{ANIMATION_PRESETS[value.preset].duration}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Live Preview Controls */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label>Live Voorbeeld</Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? <Pause size={16} /> : <Play size={16} />}
                    {previewMode ? 'Stop' : 'Start'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => value.preset && handlePreview(value.preset)}
                  >
                    <RotateCcw size={16} />
                    Herhaal
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}