import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ANIMATION_PRESETS, getAvailablePresets } from '@/utils/chartAnimations';
import { Play, RotateCcw } from '@phosphor-icons/react';

interface AnimationDemoProps {
  className?: string;
}

export function AnimationDemo({ className = '' }: AnimationDemoProps) {
  const [activePreset, setActivePreset] = useState<string>('professional');
  const [isAnimating, setIsAnimating] = useState(false);
  const presets = getAvailablePresets();

  const startAnimation = (presetKey: string) => {
    setActivePreset(presetKey);
    setIsAnimating(true);
    
    // Reset animation after duration
    const preset = ANIMATION_PRESETS[presetKey as keyof typeof ANIMATION_PRESETS];
    const duration = parseFloat(preset.duration.replace('s', '')) * 1000;
    
    setTimeout(() => {
      setIsAnimating(false);
    }, duration + 500);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => {
      startAnimation(activePreset);
    }, 100);
  };

  useEffect(() => {
    // Auto-start with professional preset
    startAnimation('professional');
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Animatie Voorbeeld</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {ANIMATION_PRESETS[activePreset as keyof typeof ANIMATION_PRESETS]?.name || 'Professional'}
              </Badge>
              <Button variant="outline" size="sm" onClick={resetAnimation}>
                <RotateCcw size={16} />
                Herhaal
              </Button>
            </div>
          </div>

          {/* Demo Chart Container */}
          <div 
            className={`
              chart-container
              chart-theme-${ANIMATION_PRESETS[activePreset as keyof typeof ANIMATION_PRESETS]?.theme || 'professional'}
              chart-type-bar
              ${isAnimating ? 'animate-in' : ''}
            `}
          >
            <Card className="p-4 bg-gradient-to-r from-card to-muted/20">
              <div className="space-y-4">
                <h4 className="chart-title font-medium text-center">Voorbeeld Grafiek</h4>
                
                {/* Simulated Bar Chart */}
                <div className="flex items-end justify-center space-x-2 h-32">
                  {[65, 45, 78, 52, 69, 41, 83].map((height, index) => (
                    <div
                      key={index}
                      className={`
                        chart-data-element chart-bar
                        bg-primary rounded-t-sm
                        ${isAnimating ? `chart-stagger-delay-${index + 1}` : ''}
                      `}
                      style={{ 
                        width: '20px',
                        height: `${height}px`,
                        transformOrigin: 'bottom',
                      }}
                    />
                  ))}
                </div>

                {/* Simulated Axis */}
                <div className="chart-axis border-t border-border pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Preset Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.key}
                variant={activePreset === preset.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => startAnimation(preset.key)}
                className="flex items-center space-x-1"
              >
                <Play size={14} />
                <span>{preset.name}</span>
              </Button>
            ))}
          </div>

          {/* Animation Info */}
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Easing:</span>
                <span className="font-mono text-xs">
                  {ANIMATION_PRESETS[activePreset as keyof typeof ANIMATION_PRESETS]?.easing}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duur:</span>
                <span>
                  {ANIMATION_PRESETS[activePreset as keyof typeof ANIMATION_PRESETS]?.duration}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Vertraging:</span>
                <span>
                  {ANIMATION_PRESETS[activePreset as keyof typeof ANIMATION_PRESETS]?.staggerDelay}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}