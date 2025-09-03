import { ChartConfig } from '@/types';

export interface AnimationPreset {
  name: string;
  theme: string;
  description: string;
  duration: string;
  easing: string;
  staggerDelay: number;
  chartSpecific: {
    line?: {
      pathAnimation: string;
      dotAnimation: string;
    };
    bar?: {
      growDirection: 'bottom' | 'top' | 'center';
      transformOrigin: string;
    };
    pie?: {
      rotationStart: number;
      scaleAnimation: boolean;
    };
  };
}

export const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  professional: {
    name: 'Professional',
    theme: 'professional',
    description: 'Smooth, corporate-friendly animations with subtle timing',
    duration: '0.8s',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    staggerDelay: 0.1,
    chartSpecific: {
      line: {
        pathAnimation: 'professionalLineDraw',
        dotAnimation: 'professionalDataReveal',
      },
      bar: {
        growDirection: 'bottom',
        transformOrigin: 'bottom center',
      },
      pie: {
        rotationStart: 0,
        scaleAnimation: true,
      },
    },
  },
  
  dynamic: {
    name: 'Dynamic',
    theme: 'dynamic',
    description: 'Energetic bouncy animations with elastic easing',
    duration: '1s',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    staggerDelay: 0.15,
    chartSpecific: {
      line: {
        pathAnimation: 'dynamicLinePulse',
        dotAnimation: 'dynamicPulseGrow',
      },
      bar: {
        growDirection: 'center',
        transformOrigin: 'center center',
      },
      pie: {
        rotationStart: -90,
        scaleAnimation: true,
      },
    },
  },
  
  smooth: {
    name: 'Smooth',
    theme: 'smooth',
    description: 'Elegant flowing animations with extended timing',
    duration: '1.2s',
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    staggerDelay: 0.08,
    chartSpecific: {
      line: {
        pathAnimation: 'smoothLineDraw',
        dotAnimation: 'smoothDotAppear',
      },
      bar: {
        growDirection: 'bottom',
        transformOrigin: 'left center',
      },
      pie: {
        rotationStart: 0,
        scaleAnimation: false,
      },
    },
  },
  
  playful: {
    name: 'Playful',
    theme: 'playful',
    description: 'Fun creative animations with rotation and bounce',
    duration: '1s',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    staggerDelay: 0.1,
    chartSpecific: {
      line: {
        pathAnimation: 'playfulLineBounce',
        dotAnimation: 'playfulBounce',
      },
      bar: {
        growDirection: 'center',
        transformOrigin: 'center bottom',
      },
      pie: {
        rotationStart: -180,
        scaleAnimation: true,
      },
    },
  },
  
  minimal: {
    name: 'Minimal',
    theme: 'minimal',
    description: 'Subtle clean animations with minimal motion',
    duration: '0.6s',
    easing: 'ease-out',
    staggerDelay: 0.05,
    chartSpecific: {
      line: {
        pathAnimation: 'minimalLineFade',
        dotAnimation: 'minimalSlideUp',
      },
      bar: {
        growDirection: 'bottom',
        transformOrigin: 'bottom center',
      },
      pie: {
        rotationStart: 0,
        scaleAnimation: false,
      },
    },
  },
  
  technical: {
    name: 'Technical',
    theme: 'technical',
    description: 'Data-focused animations with systematic timing',
    duration: '0.8s',
    easing: 'ease-out',
    staggerDelay: 0.05,
    chartSpecific: {
      line: {
        pathAnimation: 'technicalLineBuild',
        dotAnimation: 'technicalDataLoad',
      },
      bar: {
        growDirection: 'bottom',
        transformOrigin: 'left center',
      },
      pie: {
        rotationStart: 0,
        scaleAnimation: false,
      },
    },
  },
};

export interface ChartAnimationConfig extends ChartConfig {
  animation?: {
    preset?: keyof typeof ANIMATION_PRESETS;
    enabled?: boolean;
    customDuration?: string;
    customEasing?: string;
    staggerElements?: boolean;
    reduceMotion?: boolean;
    chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  };
}

export const applyAnimationPreset = (
  element: HTMLElement,
  preset: keyof typeof ANIMATION_PRESETS,
  chartType: string = 'line',
  elementIndex: number = 0
): void => {
  const presetConfig = ANIMATION_PRESETS[preset];
  if (!presetConfig) return;

  // Remove existing animation classes
  element.classList.remove(
    ...Object.keys(ANIMATION_PRESETS).map(p => `chart-theme-${p}`)
  );

  // Add theme class
  element.classList.add(`chart-theme-${presetConfig.theme}`);
  
  // Add chart type class
  element.classList.add(`chart-type-${chartType}`);
  
  // Add stagger delay if element has an index
  if (elementIndex > 0 && elementIndex <= 8) {
    element.classList.add(`chart-stagger-delay-${elementIndex}`);
  }
  
  // Apply custom CSS properties
  element.style.setProperty('--animation-duration', presetConfig.duration);
  element.style.setProperty('--animation-easing', presetConfig.easing);
  
  // Apply chart-specific configurations
  const chartSpecific = presetConfig.chartSpecific[chartType as keyof typeof presetConfig.chartSpecific];
  if (chartSpecific) {
    Object.entries(chartSpecific).forEach(([key, value]) => {
      element.style.setProperty(`--chart-${key}`, value.toString());
    });
  }
};

export const getAnimationClass = (
  preset: keyof typeof ANIMATION_PRESETS,
  chartType: string,
  elementType: 'container' | 'data' | 'axis' | 'legend' = 'container'
): string => {
  const presetConfig = ANIMATION_PRESETS[preset];
  if (!presetConfig) return '';
  
  const baseClasses = [
    `chart-theme-${presetConfig.theme}`,
    `chart-type-${chartType}`,
  ];
  
  if (elementType === 'data') {
    baseClasses.push('chart-data-element');
  }
  
  return baseClasses.join(' ');
};

export const createAnimationStyle = (config: ChartAnimationConfig): string => {
  if (!config.animation?.enabled || !config.animation.preset) {
    return '';
  }
  
  const preset = ANIMATION_PRESETS[config.animation.preset];
  if (!preset) return '';
  
  const duration = config.animation.customDuration || preset.duration;
  const easing = config.animation.customEasing || preset.easing;
  
  return `
    --animation-duration: ${duration};
    --animation-easing: ${easing};
    --stagger-delay: ${preset.staggerDelay}s;
  `;
};

export const shouldReduceMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const initializeChartAnimations = (
  container: HTMLElement,
  config: ChartAnimationConfig
): void => {
  if (!config.animation?.enabled || shouldReduceMotion()) {
    container.classList.add('chart-no-animation');
    return;
  }
  
  const preset = config.animation.preset || 'professional';
  const chartType = config.animation.chartType || 'line';
  
  // Apply animation preset to container
  applyAnimationPreset(container, preset, chartType);
  
  // Apply custom styles
  const customStyle = createAnimationStyle(config);
  if (customStyle) {
    container.setAttribute('style', container.getAttribute('style') + customStyle);
  }
  
  // Apply staggered animations to data elements if enabled
  if (config.animation.staggerElements) {
    const dataElements = container.querySelectorAll('.chart-data-element');
    dataElements.forEach((element, index) => {
      applyAnimationPreset(element as HTMLElement, preset, chartType, index + 1);
    });
  }
};

export const animateChartUpdate = (
  container: HTMLElement,
  preset: keyof typeof ANIMATION_PRESETS = 'professional'
): void => {
  const presetConfig = ANIMATION_PRESETS[preset];
  if (!presetConfig || shouldReduceMotion()) return;
  
  // Add update animation class
  container.classList.add('chart-updating');
  
  // Remove the class after animation completes
  setTimeout(() => {
    container.classList.remove('chart-updating');
  }, parseFloat(presetConfig.duration) * 1000);
};

export const getAvailablePresets = (): Array<{
  key: keyof typeof ANIMATION_PRESETS;
  name: string;
  description: string;
}> => {
  return Object.entries(ANIMATION_PRESETS).map(([key, preset]) => ({
    key: key as keyof typeof ANIMATION_PRESETS,
    name: preset.name,
    description: preset.description,
  }));
};