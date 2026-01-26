import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
}

/**
 * LazyImage component that uses Intersection Observer for efficient image loading
 * 
 * Features:
 * - Intersection Observer API for performance
 * - Placeholder support
 * - Error handling
 * - Customizable threshold and root margin
 * - Blur-up effect for smooth loading
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3C/svg%3E',
  className = '',
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Create Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          // Stop observing once the image is in view
          observerRef.current?.unobserve(img);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Start observing
    observerRef.current.observe(img);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  // Generate error placeholder
  const errorPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23fef2f2"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23dc2626" font-family="sans-serif"%3EFailed to load%3C/text%3E%3C/svg%3E';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={isInView ? (hasError ? errorPlaceholder : src) : placeholder}
        alt={alt}
        className={`
          transition-all duration-300 ease-in-out
          ${isLoaded ? 'opacity-100 blur-0' : 'opacity-75 blur-sm'}
          ${hasError ? 'opacity-50' : ''}
        `}
        onLoad={handleLoad}
        onError={handleError}
        {...imgProps}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error indicator */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <div className="text-center">
            <svg
              className="w-8 h-8 text-red-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-sm text-red-600">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Hook for lazy loading images with more control
 */
export const useLazyImage = (
  threshold: number = 0.1,
  rootMargin: string = '50px'
) => {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return {
    isInView,
    ref: elementRef,
  };
};

/**
 * Background image component with lazy loading
 */
export const LazyBackground: React.FC<{
  src: string;
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
}> = ({
  src,
  className = '',
  children,
  placeholder = '#e5e7eb',
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = bgRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [isInView, src]);

  return (
    <div
      ref={bgRef}
      className={className}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        backgroundColor: !isLoaded ? placeholder : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.7,
      }}
    >
      {children}
    </div>
  );
};

export default LazyImage;
