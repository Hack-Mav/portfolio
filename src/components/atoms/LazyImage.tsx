import { useState, useRef, useEffect, useCallback } from 'react'
import { observe, unobserve } from '@/utils/intersectionObserver'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: string
  className?: string
  imgClassName?: string
  onLoad?: () => void
  onError?: () => void
  threshold?: number
  rootMargin?: string
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
  srcSet,
  sizes,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3C/svg%3E',
  className = '',
  imgClassName = '',
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  loading = 'lazy',
  decoding = 'async',
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  // Handle image error
  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    return observe(
      img,
      entry => {
        if (entry.isIntersecting) {
          setIsInView(true)
          unobserve(img)
        }
      },
      { threshold, rootMargin }
    )
  }, [threshold, rootMargin])

  // Generate error placeholder
  const errorPlaceholder =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23fef2f2"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23dc2626" font-family="sans-serif"%3EFailed to load%3C/text%3E%3C/svg%3E'

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={isInView ? (hasError ? errorPlaceholder : src) : placeholder}
        srcSet={isInView && !hasError ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={`
          transition-all duration-300 ease-in-out
          ${isLoaded ? 'opacity-100 blur-0' : 'opacity-75 blur-sm'}
          ${hasError ? 'opacity-50' : ''}
          ${imgClassName}
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
  )
}

export default LazyImage
