// Performance monitoring utility
export const measurePerformance = () => {
  // Measure page load time
  window.addEventListener('load', () => {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page Load Time: ${pageLoadTime}ms`);

    // Report to analytics if needed
    if (pageLoadTime > 3000) {
      console.warn('Page load time exceeds 3 seconds');
    }
  });

  // Monitor Core Web Vitals
  if ('web-vital' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log); // Cumulative Layout Shift
      getFID(console.log); // First Input Delay
      getFCP(console.log); // First Contentful Paint
      getLCP(console.log); // Largest Contentful Paint
      getTTFB(console.log); // Time to First Byte
    });
  }
};

// Resource timing monitoring
export const monitorResourceTiming = () => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) { 
      if (entry.duration > 1000) {
        console.warn(`Slow resource: ${entry.name} (${entry.duration}ms)`);
      }
    }
  });

  observer.observe({ entryTypes: ['resource'] });
};

// Error tracking
export const trackErrors = () => {
  window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    // Add your error reporting logic here
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Add your error reporting logic here
  });
};
