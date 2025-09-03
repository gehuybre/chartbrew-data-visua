import { useEffect, useRef, useState } from 'react';

interface ScrollytellingProps {
  htmlContent: string;
  onChartVisible?: (chartId: string) => void;
  className?: string;
}

export function Scrollytelling({ htmlContent, onChartVisible, className = '' }: ScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && htmlContent) {
      // Parse the HTML content
      containerRef.current.innerHTML = htmlContent;
      
      // Find all sections with chart placeholders
      const chartPlaceholders = Array.from(
        containerRef.current.querySelectorAll('[data-chart]')
      ) as HTMLElement[];
      
      // Set up intersection observers for chart sections
      const observers: IntersectionObserver[] = [];
      
      chartPlaceholders.forEach(placeholder => {
        const chartId = placeholder.getAttribute('data-chart');
        if (chartId) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting && onChartVisible) {
                  onChartVisible(chartId);
                }
              });
            },
            { threshold: 0.3 }
          );
          
          observer.observe(placeholder);
          observers.push(observer);
        }
      });
      
      return () => {
        observers.forEach(observer => observer.disconnect());
      };
    }
  }, [htmlContent, onChartVisible]);

  return (
    <div 
      ref={containerRef}
      className={`scrollytelling-container ${className}`}
    />
  );
}

interface ScrollySectionProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollySection({ children, className = '' }: ScrollySectionProps) {
  return (
    <div className={`scrolly-section ${className}`}>
      {children}
    </div>
  );
}