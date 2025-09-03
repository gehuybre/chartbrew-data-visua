import { useEffect, useRef, useState } from 'react';

interface UseChartAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useChartAnimation(options: UseChartAnimationOptions = {}) {
  const {
    threshold = 0.3,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasAnimated, delay]);

  return { ref, isVisible, hasAnimated };
}

export function useStaggeredAnimation(
  itemCount: number,
  staggerDelay: number = 100,
  startDelay: number = 0
) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );

  const startAnimation = () => {
    for (let i = 0; i < itemCount; i++) {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newVisible = [...prev];
          newVisible[i] = true;
          return newVisible;
        });
      }, startDelay + i * staggerDelay);
    }
  };

  const resetAnimation = () => {
    setVisibleItems(new Array(itemCount).fill(false));
  };

  return { visibleItems, startAnimation, resetAnimation };
}

export function useChartTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = async (duration: number = 500) => {
    setIsTransitioning(true);
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setIsTransitioning(false);
        resolve();
      }, duration);
    });
  };

  return { isTransitioning, startTransition };
}