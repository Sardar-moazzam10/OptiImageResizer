import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

const metrics: PerformanceMetrics = {
  fcp: null, // First Contentful Paint
  lcp: null, // Largest Contentful Paint
  fid: null, // First Input Delay
  cls: null, // Cumulative Layout Shift
  ttfb: null, // Time to First Byte
};

export function initializePerformanceMonitoring() {
  if (!window.performance || !window.performance.getEntriesByType) {
    console.warn('Performance API not supported');
    return;
  }

  // Observer for First Contentful Paint
  const paintObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        metrics.fcp = entry.startTime;
        console.log(`FCP: ${metrics.fcp}ms`);
      }
    }
  });

  // Observer for Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    metrics.lcp = lastEntry.startTime;
    console.log(`LCP: ${metrics.lcp}ms`);
  });

  // Observer for First Input Delay
  const fidObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      metrics.fid = entry.processingStart - entry.startTime;
      console.log(`FID: ${metrics.fid}ms`);
    }
  });

  // Observer for Cumulative Layout Shift
  const clsObserver = new PerformanceObserver((entryList) => {
    let clsValue = 0;
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    metrics.cls = clsValue;
    console.log(`CLS: ${metrics.cls}`);
  });

  // Measure TTFB
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    metrics.ttfb = navigation.responseStart - navigation.requestStart;
    console.log(`TTFB: ${metrics.ttfb}ms`);
  }

  try {
    paintObserver.observe({ entryTypes: ['paint'] });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    fidObserver.observe({ entryTypes: ['first-input'] });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    console.warn('Performance observers failed to initialize:', error);
  }

  // Report metrics to analytics
  window.addEventListener('beforeunload', () => {
    reportMetrics(metrics);
  });
}

function reportMetrics(metrics: PerformanceMetrics) {
  // TODO: Implement your analytics reporting here
  // Example: Send to Google Analytics or your custom analytics endpoint
  console.log('Performance Metrics:', metrics);
}

// React hook for component-level performance monitoring
export function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`Component ${componentName} rendered in ${duration}ms`);
    };
  }, [componentName]);
}

// Utility function to measure async operations
export async function measureAsync<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await operation();
    const endTime = performance.now();
    console.log(`${operationName} took ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`${operationName} failed after ${endTime - startTime}ms:`, error);
    throw error;
  }
} 